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
  
  // Find the manifest file
  const files = fs.readdirSync(distPath);
  const manifestFile = files.find(file => 
    file.startsWith('static-loader-data-manifest-') && file.endsWith('.json')
  );
  
  if (!manifestFile) {
    console.warn('⚠️ No SSG manifest file found. Creating empty pointer.');
    
    // Create empty pointer for non-SSG builds
    const manifestInfo = {
      id: null,
      path: null,
      exists: false
    };
    
    fs.writeFileSync(
      path.join(distPath, 'manifestInfo.json'),
      JSON.stringify(manifestInfo, null, 2)
    );
    
    console.log('✅ Created empty manifest pointer');
    return;
  }
  
  // Extract ID from filename
  const idMatch = manifestFile.match(/static-loader-data-manifest-(.+)\.json$/);
  const manifestId = idMatch ? idMatch[1] : 'unknown';
  
  // Create manifest info
  const manifestInfo = {
    id: manifestId,
    path: `/${manifestFile}`,
    exists: true,
    generatedAt: new Date().toISOString()
  };
  
  // Write manifest pointer
  const manifestInfoPath = path.join(distPath, 'manifestInfo.json');
  fs.writeFileSync(manifestInfoPath, JSON.stringify(manifestInfo, null, 2));
  
  console.log(`✅ Generated manifest pointer: ${manifestFile}`);
  console.log(`📝 Manifest ID: ${manifestId}`);
  console.log(`📄 Pointer saved to: manifestInfo.json`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateManifestPointer();
}

export { generateManifestPointer };