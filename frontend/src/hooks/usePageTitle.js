import { useEffect } from 'react';

const BASE = 'Achievement POAP';

/**
 * Set document title and meta description for the active route.
 * @param {string} title - Page-specific title segment
 * @param {string} [description] - Optional meta description
 */
export function usePageTitle(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | ${BASE}` : BASE;

    let meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? '';

    if (description && meta) {
      meta.setAttribute('content', description);
    }

    return () => {
      document.title = prevTitle;
      if (description && meta) meta.setAttribute('content', prevDesc);
    };
  }, [title, description]);
}

export default usePageTitle;
