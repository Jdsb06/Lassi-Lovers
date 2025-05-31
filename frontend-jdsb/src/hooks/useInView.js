import { useState, useEffect, useRef } from 'react';

// Hook to detect when an element is visible in the viewport
export default function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px',
      ...options
    });

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [options.threshold, options.rootMargin]);

  return [ref, isInView];
}
