/** @file frontend/src/hooks/index.js - Custom hook module documenting state and side-effect responsibilities. */
// Hooks exports
export * from './useContract';
export { useFocusTrap, useAnnounce, useReducedMotion } from './useAccessibility';
export { useLocalStorage, useSessionStorage } from './useLocalStorage';
export { useDebounce, useThrottle, useDebouncedCallback } from './useDebounce';
export { useIntersectionObserver, useLazyLoad, useInfiniteScroll } from './useIntersectionObserver';
export { useMediaQuery, useBreakpoint, useWindowSize } from './useMediaQuery';
export { useClipboard, useShare } from './useClipboard';
export { useFetch, useMutation } from './useFetch';
// hook export PR-1

// optimize performance for hook-composition — ref:refactor/hook-composition#8 (1776635155578)
