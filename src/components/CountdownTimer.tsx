'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetTime: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Cleanup
    return () => clearInterval(timer);
  }, [targetTime]);
  
  // Format numbers to always have two digits
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
        {isExpired ? "🎉 Voting Ended! 🎉" : "⏰ Next Tokenization In:"}
      </h2>
      <div className="flex items-center justify-center space-x-4 text-3xl font-mono">
        <div className="flex flex-col items-center">
          <div className="bg-white text-blue-600 px-5 py-4 rounded-lg shadow-md border border-blue-100">
            {formatNumber(timeLeft.hours)}
          </div>
          <span className="text-xs mt-2 text-gray-600 font-semibold">HOURS</span>
        </div>
        <span className="text-3xl text-gray-400 animate-pulse">:</span>
        <div className="flex flex-col items-center">
          <div className="bg-white text-blue-600 px-5 py-4 rounded-lg shadow-md border border-blue-100">
            {formatNumber(timeLeft.minutes)}
          </div>
          <span className="text-xs mt-2 text-gray-600 font-semibold">MINUTES</span>
        </div>
        <span className="text-3xl text-gray-400 animate-pulse">:</span>
        <div className="flex flex-col items-center">
          <div className="bg-white text-blue-600 px-5 py-4 rounded-lg shadow-md border border-blue-100">
            {formatNumber(timeLeft.seconds)}
          </div>
          <span className="text-xs mt-2 text-gray-600 font-semibold">SECONDS</span>
        </div>
      </div>
      <p className="text-center text-gray-600 mt-4 text-sm max-w-md mx-auto">
        When the timer reaches zero, the winning egg will be tokenized and a new voting round begins!
      </p>
    </div>
  );
};

export default CountdownTimer;
