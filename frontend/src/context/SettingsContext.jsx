import React, { createContext, useContext, useReducer, useCallback } from 'react';

const initialState = {
  theme: 'dark',
  language: 'en',
  currency: 'USD',
  notifications: true,
  soundEnabled: true,
  compactMode: false,
  autoConnect: true,
};

const SettingsContext = createContext(null);

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'TOGGLE_COMPACT_MODE':
      return { ...state, compactMode: !state.compactMode };
    case 'TOGGLE_AUTO_CONNECT':
      return { ...state, autoConnect: !state.autoConnect };
    case 'LOAD_SETTINGS':
      return { ...state, ...action.payload };
    case 'RESET_SETTINGS':
      return initialState;
    default:
      return state;
  }
};

export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState, () => {
    try {
      const saved = localStorage.getItem('app-settings');
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
    } catch {
      return initialState;
    }
  });

  const setTheme = useCallback((theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const setLanguage = useCallback((language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  }, []);

  const setCurrency = useCallback((currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
  }, []);

  const toggleNotifications = useCallback(() => {
    dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const toggleCompactMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_COMPACT_MODE' });
  }, []);

  const toggleAutoConnect = useCallback(() => {
    dispatch({ type: 'TOGGLE_AUTO_CONNECT' });
  }, []);

  const resetSettings = useCallback(() => {
    dispatch({ type: 'RESET_SETTINGS' });
    localStorage.removeItem('app-settings');
  }, []);

  React.useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(state));
  }, [state]);

  const value = {
    ...state,
    setTheme,
    setLanguage,
    setCurrency,
    toggleNotifications,
    toggleSound,
    toggleCompactMode,
    toggleAutoConnect,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
