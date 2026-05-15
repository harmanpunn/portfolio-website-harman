#!/usr/bin/env node

/**
 * Post-build fix for vite-react-ssg script ordering.
 *
 * vite-react-ssg emits `<script>window.__VITE_REACT_SSG_HASH__ = '...'</script>`
 * deep in the <body>, AFTER the main module bundle's <script> tag. Because the
 * bundle is `type="module" async`, it can execute *before* the document parser
 * reaches the hash-setter — leaving __VITE_REACT_SSG_HASH__ as undefined and
 * causing the bundle to fetch /static-loader-data-manifest-undefined.json, which
 * 404s and triggers a React hydration mismatch.
 *
 * This script reorders the HTML so the hash assignment runs BEFORE the bundle.
 * Walks every .html under dist/ and rewrites each one.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

const HASH_TAG_RE = /<script\b[^>]*>\s*window\.__VITE_REACT_SSG_HASH__\s*=\s*['"][^'"]+['"]\s*<\/script>/;
const BUNDLE_TAG_RE = /<script\s+type="module"\s+async\s+crossorigin\s+src="[^"]+\.js"><\/script>/;

function walkHtml(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkHtml(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function fixFile(file) {
  let html = fs.readFileSync(file, 'utf8');
  const hashMatch = html.match(HASH_TAG_RE);
  const bundleMatch = html.match(BUNDLE_TAG_RE);

  if (!hashMatch) return { file, status: 'skip-no-hash' };
  if (!bundleMatch) return { file, status: 'skip-no-bundle' };

  const hashTag = hashMatch[0];
  const bundleTag = bundleMatch[0];
  const hashIndex = html.indexOf(hashTag);
  const bundleIndex = html.indexOf(bundleTag);

  // Already in the correct order (hash before bundle in document order) — done.
  if (hashIndex < bundleIndex) return { file, status: 'skip-already-correct' };

  // Remove the original hash tag from wherever it is.
  html = html.slice(0, hashIndex) + html.slice(hashIndex + hashTag.length);

  // Re-find the bundle (its index may have shifted slightly after removal).
  const newBundleIndex = html.indexOf(bundleTag);
  if (newBundleIndex === -1) return { file, status: 'error-bundle-vanished' };

  // Insert the hash setter immediately BEFORE the bundle script. Inline scripts
  // execute synchronously as the parser reaches them, so being positioned
  // before the async module bundle in document order guarantees the hash is
  // set when the bundle runs.
  html =
    html.slice(0, newBundleIndex) +
    hashTag +
    '\n    ' +
    html.slice(newBundleIndex);

  fs.writeFileSync(file, html, 'utf8');
  return { file, status: 'fixed' };
}

console.log('🔧 Fixing script order so __VITE_REACT_SSG_HASH__ is set before the async bundle runs…');

if (!fs.existsSync(distDir)) {
  console.warn('⚠️  dist/ not found — run after build.');
  process.exit(0);
}

const files = walkHtml(distDir);
let fixed = 0, skipped = 0;
for (const file of files) {
  const result = fixFile(file);
  const rel = path.relative(distDir, file);
  if (result.status === 'fixed') {
    console.log(`  ✅ ${rel}`);
    fixed++;
  } else {
    console.log(`  ⏭️  ${rel} (${result.status})`);
    skipped++;
  }
}

console.log(`\n   Done — ${fixed} fixed, ${skipped} skipped.`);
