// This file contains global type declarations for TypeScript

// Extend the Window interface to include ethereum property
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
    selectedAddress?: string;
    isConnected: () => boolean;
    chainId?: string;
  };
}
