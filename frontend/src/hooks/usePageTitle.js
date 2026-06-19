/** @file frontend/src/hooks/usePageTitle.js */
import { useEffect } from 'react';
import { APP_NAME } from '../config/constants';

export function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
    if (!description) return;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
  }, [title, description]);
}
