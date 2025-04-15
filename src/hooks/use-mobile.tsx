
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Use null initial state to indicate that we don't know yet
  // This prevents incorrect initial rendering
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener with debounce for better performance
    let resizeTimer: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        checkScreenSize();
      }, 100); // 100ms debounce
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return isMobile;
}
