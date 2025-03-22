'use client';

import { useState, useEffect, useRef } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import PresentBox from '@/components/PresentBox';
import { useAuth } from '@/context/AuthContext';

// Create an array of 20 egg boxes with zero initial votes as fallback
const initialEggs = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  votes: 0 // All votes start at 0
}));

export default function Home() {
  const { address, isConnected, connectWallet } = useAuth();
  const [eggs, setEggs] = useState(initialEggs);
  const [userVoted, setUserVoted] = useState<number | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info' | null}>({
    message: '',
    type: null
  });
  
  // Ref for notification timeout
  const notificationTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Set target time to 6:15 AM
  const now = new Date();
  const targetTime = new Date(now);
  targetTime.setHours(6, 15, 0, 0);
  
  // If it's already past 6:15 AM, set target to tomorrow
  if (now > targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }
  
  // Sort eggs by votes (highest first)
  const sortedEggs = [...eggs].sort((a, b) => b.votes - a.votes);
  
  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // Clear any existing timeout
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
    
    setNotification({ message, type });
    
    // Auto-hide notification after 5 seconds
    notificationTimeout.current = setTimeout(() => {
      setNotification({ message: '', type: null });
    }, 5000);
  };
  
  // Fetch all eggs and votes from the database
  const fetchEggs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/votes');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch eggs');
      }
      
      if (data.eggs && Array.isArray(data.eggs)) {
        setEggs(data.eggs);
        
        // Calculate total votes
        const total = data.eggs.reduce((sum: number, egg: any) => sum + (egg.votes || 0), 0);
        setTotalVotes(total);
      }
    } catch (error) {
      console.error('Error fetching eggs:', error);
      showNotification('Failed to load eggs data', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if user has already voted
  const checkUserVote = async () => {
    if (!address) return;
    
    try {
      // Call the API to check if the user has already voted
      const response = await fetch('/api/votes/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
        }),
      });
      
      if (!response.ok) return;
      
      const data = await response.json();
      
      if (data.hasVoted && data.eggId !== undefined) {
        setUserVoted(Number(data.eggId));
      } else {
        // Fallback to localStorage if the API doesn't find a vote
        const savedVote = localStorage.getItem(`userVoted_${address}`);
        if (savedVote) {
          const voteId = Number(savedVote);
          setUserVoted(voteId);
        }
      }
    } catch (error) {
      console.error('Error checking user vote:', error);
    }
  };
  
  // Handle voting with real backend interaction
  const handleVote = async (id: number) => {
    if (!isConnected || !address) {
      showNotification('Please connect your wallet to vote', 'info');
      return;
    }
    
    if (userVoted !== null) {
      showNotification('You have already voted!', 'info');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Real API call to backend
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eggId: Number(id),
          walletAddress: address,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit vote');
      }
      
      // Update eggs with the latest data from the server
      if (data.allEggs && Array.isArray(data.allEggs)) {
        setEggs(data.allEggs);
        
        // Calculate total votes
        const total = data.allEggs.reduce((sum: number, egg: any) => sum + (egg.votes || 0), 0);
        setTotalVotes(total);
      }
      
      setUserVoted(Number(id));
      
      // Save vote to localStorage as a fallback
      localStorage.setItem(`userVoted_${address}`, String(id));
      
      // Show success message
      showNotification('Your vote has been recorded! Thank you for voting.', 'success');
    } catch (error: any) {
      console.error("Error submitting vote:", error);
      showNotification(error.message || 'There was an error submitting your vote. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fetch eggs on component mount
  useEffect(() => {
    fetchEggs();
  }, []);
  
  // Check if user has already voted when address changes
  useEffect(() => {
    if (address) {
      checkUserVote();
    } else {
      setUserVoted(null);
    }
  }, [address]);
  
  // Clean up notification timeout on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification.type && (
          <div className={`fixed top-20 right-4 z-50 max-w-md transition-all duration-500 transform translate-y-0 opacity-100 ${
            notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' :
            notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' :
            'bg-blue-50 border-blue-500 text-blue-700'
          } border-l-4 p-4 rounded-lg shadow-lg`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">{notification.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setNotification({ message: '', type: null })}
                    className={`inline-flex rounded-md p-1.5 ${
                      notification.type === 'success' ? 'text-green-500 hover:bg-green-100' :
                      notification.type === 'error' ? 'text-red-500 hover:bg-red-100' :
                      'text-blue-500 hover:bg-blue-100'
                    } focus:outline-none`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Countdown Timer */}
        <div className="mb-12">
          <CountdownTimer targetTime={targetTime} />
        </div>
        
        
        {/* Voting Stats */}
        <div className="flex justify-center mb-8">
          <div className="bg-white shadow-xl rounded-xl px-8 py-6 flex items-center space-x-8 border border-gray-100">
            <div className="text-center">
              <span className="block text-sm text-gray-500 font-medium">Total Votes</span>
              <span className="block text-3xl font-bold text-gray-800">{totalVotes}</span>
            </div>
            <div className="h-14 border-l border-gray-200"></div>
            <div className="text-center">
              <span className="block text-sm text-gray-500 font-medium">Your Vote</span>
              <span className="block text-3xl font-bold text-gray-800">
                {userVoted ? `Egg #${userVoted}` : "None"}
              </span>
            </div>
            <div className="h-14 border-l border-gray-200"></div>
            <div className="text-center">
              <button 
                onClick={fetchEggs}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors duration-200 flex items-center"
              >
                <svg 
                  className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'Refreshing...' : 'Refresh Votes'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Eggs Grid - Sorted by votes */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {sortedEggs.map((egg, index) => (
              <PresentBox 
                key={egg.id} 
                id={egg.id} 
                votes={egg.votes} 
                onVote={handleVote}
                isLoggedIn={isConnected}
                rank={index < 3 && egg.votes > 0 ? index + 1 : undefined}
              />
            ))}
          </div>
        </div>
        
        {/* Information Section */}
        <div className="mt-16 bg-white shadow-xl rounded-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
            🥚 How It Works
          </h2>
          <ol className="list-decimal pl-5 space-y-3 text-gray-600">
            <li className="text-lg">Each mystery egg contains a cute dog waiting to be discovered</li>
            <li className="text-lg">Connect your wallet to vote for your favorite egg</li>
            <li className="text-lg">You can only vote once per round</li>
            <li className="text-lg">When the timer reaches zero, the winning egg hatches and the dog becomes a token on four.meme</li>
            <li className="text-lg">Every voter who voted for the winning egg gets airdropped supply automatically</li>
            <li className="text-lg">A new voting round begins immediately with fresh eggs</li>
            <li className="text-lg">This creates a sustainable ecosystem of cute dog memecoins</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
