'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface AuthContextType {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            setAddress(accounts[0].address);
            setIsConnected(true);
            
            // Register the user or check if they exist
            await registerOrLoginUser(accounts[0].address);
          }
        } catch (err) {
          console.error('Failed to check connection:', err);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setAddress(null);
          setIsConnected(false);
        } else {
          // Account changed
          setAddress(accounts[0]);
          setIsConnected(true);
          
          // Register the user or check if they exist
          await registerOrLoginUser(accounts[0]);
        }
      };

      const ethereum = window.ethereum;
      if (ethereum) {
        ethereum.on('accountsChanged', handleAccountsChanged);

        return () => {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
      }
    }
  }, []);

  const registerOrLoginUser = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/auth/metamask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletAddress }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to register/login user');
      }
      
      const data = await response.json();
      console.log('User registered/logged in:', data);
      
      // You could store additional user data here if needed
    } catch (err) {
      console.error('Error registering/logging in user:', err);
      setError('Failed to register/login user');
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is not installed');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        // Register the user or check if they exist
        await registerOrLoginUser(accounts[0]);
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
  };

  const value = {
    address,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
