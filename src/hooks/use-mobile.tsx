
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return isMobile;
}
