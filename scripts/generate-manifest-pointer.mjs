#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate manifest pointer file to resolve the undefined manifest issue
 */
function generateManifestPointer() {
  console.log('🔍 Generating manifest pointer...');
  
  const distPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist folder not found. Run build first.');
    process.exit(1);
  }
  
  // Find the manifest files - prioritize valid ones and clean up undefined ones
  const files = fs.readdirSync(distPath);
  const manifestFiles = files.filter(file => 
    file.startsWith('static-loader-data-manifest-') && file.endsWith('.json')
  );
  
  // Remove any undefined manifest files
  const undefinedManifests = manifestFiles.filter(file => 
    file.includes('undefined')
  );
  
  undefinedManifests.forEach(undefinedFile => {
    const filePath = path.join(distPath, undefinedFile);
    try {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Removed undefined manifest: ${undefinedFile}`);
    } catch (err) {
      console.warn(`⚠️ Could not remove ${undefinedFile}:`, err.message);
    }
  });
  
  // Find valid manifest files (excluding undefined ones)
  const validManifestFiles = manifestFiles.filter(file => 
    !file.includes('undefined') && !file.includes('null')
  );
  
  if (validManifestFiles.length === 0) {
    console.warn('⚠️ No valid SSG manifest file found. Creating empty pointer.');
    
    // Create empty pointer for non-SSG builds
    const manifestInfo = {
      id: null,
      path: null,
      exists: false,
      message: 'No valid manifest found - SSG may not have generated properly'
    };
    
    fs.writeFileSync(
      path.join(distPath, 'manifestInfo.json'),
      JSON.stringify(manifestInfo, null, 2)
    );
    
    console.log('✅ Created empty manifest pointer');
    return;
  }
  
  // Use the first valid manifest file
  const manifestFile = validManifestFiles[0];
  console.log(`📄 Found valid manifests: ${validManifestFiles.length}, using: ${manifestFile}`);
  
  // Extract ID from filename
  const idMatch = manifestFile.match(/static-loader-data-manifest-(.+)\.json$/);
  const manifestId = idMatch ? idMatch[1] : 'unknown';
  
  if (manifestId === 'unknown') {
    console.error('❌ Could not extract manifest ID from filename:', manifestFile);
  }
  
  // Create manifest info
  const manifestInfo = {
    id: manifestId,
    path: `/${manifestFile}`,
    exists: true,
    generatedAt: new Date().toISOString(),
    totalManifests: validManifestFiles.length,
    cleanedUndefined: undefinedManifests.length
  };
  
  // Write manifest pointer
  const manifestInfoPath = path.join(distPath, 'manifestInfo.json');
  fs.writeFileSync(manifestInfoPath, JSON.stringify(manifestInfo, null, 2));
  
  console.log(`✅ Generated manifest pointer: ${manifestFile}`);
  console.log(`📝 Manifest ID: ${manifestId}`);
  console.log(`📄 Pointer saved to: manifestInfo.json`);
  console.log(`🧹 Cleaned ${undefinedManifests.length} undefined manifest files`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateManifestPointer();
}

export { generateManifestPointer };