import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export const useMobileScreen = (): boolean => {
  return useMediaQuery('(max-width: 768px)');
};

export const useTabletScreen = (): boolean => {
  return useMediaQuery('(max-width: 1024px)');
};

export const useDesktopScreen = (): boolean => {
  return useMediaQuery('(min-width: 1025px)');
};

