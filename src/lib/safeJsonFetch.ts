/**
 * Safe JSON fetch with Content-Type validation
 * Prevents HTML being parsed as JSON which causes the "Unexpected token '<'" error
 */
export async function safeJsonFetch(url: string, options?: RequestInit): Promise<any> {
  const response = await fetch(url, {
    headers: { 
      'Accept': 'application/json',
      ...options?.headers 
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.warn(`Expected JSON but got ${contentType || 'unknown content type'}:`, text.substring(0, 200));
    throw new Error(`Invalid content type: expected application/json, got ${contentType || 'unknown'}`);
  }

  return response.json();
}

/**
 * Load manifest using the build-time generated pointer
 * This avoids the undefined manifest filename issue
 */
export async function loadManifestData(): Promise<any> {
  try {
    // First, get the manifest pointer
    const manifestInfo = await safeJsonFetch('/manifestInfo.json');
    
    if (!manifestInfo.exists || !manifestInfo.path) {
      console.log('No SSG manifest available, using client-side rendering');
      return null;
    }

    // Load the actual manifest using the pointer
    console.log(`Loading SSG manifest: ${manifestInfo.path}`);
    const manifestData = await safeJsonFetch(manifestInfo.path);
    
    return manifestData;
  } catch (error) {
    console.warn('Failed to load SSG manifest, falling back to client-side rendering:', error);
    return null;
  }
}