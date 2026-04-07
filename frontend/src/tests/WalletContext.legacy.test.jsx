import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WalletProvider, useWallet } from '../context/WalletContext';

// Mock Stacks Connect
vi.mock('@stacks/connect', () => ({
  showConnect: vi.fn(),
  userSession: {
    isUserSignedIn: vi.fn(() => false),
    loadUserData: vi.fn(() => ({
      profile: { stxAddress: { mainnet: 'SP123...' } }
    })),
    signUserOut: vi.fn(),
  },
  AppConfig: vi.fn(),
  UserSession: vi.fn(() => ({
    isUserSignedIn: vi.fn(() => false),
    loadUserData: vi.fn(),
    signUserOut: vi.fn(),
  })),
}));

describe('WalletContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const wrapper = ({ children }) => (
    <WalletProvider>{children}</WalletProvider>
  );

  it('provides initial disconnected state', () => {
    const { result } = renderHook(() => useWallet(), { wrapper });
    
    expect(result.current.isConnected).toBe(false);
    expect(result.current.address).toBe(null);
    expect(result.current.balance).toBe(null);
  });

  it('provides connect function', () => {
    const { result } = renderHook(() => useWallet(), { wrapper });
    expect(typeof result.current.connect).toBe('function');
  });

  it('provides disconnect function', () => {
    const { result } = renderHook(() => useWallet(), { wrapper });
    expect(typeof result.current.disconnect).toBe('function');
  });

  it('updates loading state during connection', async () => {
    const { result } = renderHook(() => useWallet(), { wrapper });
    
    expect(result.current.isLoading).toBe(false);
  });

  it('throws error when used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useWallet());
    }).toThrow();
    
    consoleError.mockRestore();
  });
});
