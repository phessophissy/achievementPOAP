import { useState, useEffect, useRef, useCallback } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const targetRef = useRef(null);

  const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const frozen = freezeOnceVisible && isIntersecting;
    if (frozen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible, isIntersecting]);

  return { targetRef, isIntersecting, entry };
};

export const useLazyLoad = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { targetRef, isIntersecting } = useIntersectionObserver({
    freezeOnceVisible: true,
    ...options,
  });

  useEffect(() => {
    if (isIntersecting && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
    }
  }, [isIntersecting, src]);

  return { targetRef, imageSrc, isLoaded };
};

export const useInfiniteScroll = (callback, options = {}) => {
  const { threshold = 100, enabled = true } = options;
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (!enabled) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [callback, enabled]
  );

  return lastElementRef;
};

export default useIntersectionObserver;
