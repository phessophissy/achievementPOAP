import { useEffect, useCallback } from 'react';

export const useFocusTrap = (containerRef, isActive = true) => {
  const handleKeyDown = useCallback((event) => {
    if (!isActive || !containerRef.current) return;
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }, [containerRef, isActive]);

  useEffect(() => {
    if (!isActive) return;
    document.addEventListener('keydown', handleKeyDown);
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements?.[0]?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, isActive, containerRef]);
};

export const useAnnounce = () => {
  return useCallback((message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  }, []);
};

export const useReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
