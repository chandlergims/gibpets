'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PresentBoxProps {
  id: number;
  votes: number;
  onVote: (id: number) => void;
  isLoggedIn: boolean;
  rank?: number; // Optional rank for top eggs
}

// Array of egg colors and glows
const eggColors = [
  { base: '#FFD6E0', spots: '#FFACC7', glow: 'rgba(255, 182, 193, 0.7)' }, // Pink
  { base: '#D4F0F0', spots: '#8FDDDF', glow: 'rgba(135, 206, 250, 0.7)' }, // Blue
  { base: '#FFF2CC', spots: '#FFD966', glow: 'rgba(255, 217, 102, 0.7)' }, // Yellow
  { base: '#E2F0CB', spots: '#C5E1A5', glow: 'rgba(197, 225, 165, 0.7)' }, // Green
  { base: '#D7BDE2', spots: '#BB8FCE', glow: 'rgba(187, 143, 206, 0.7)' }, // Purple
  { base: '#F8CECC', spots: '#EA9999', glow: 'rgba(234, 153, 153, 0.7)' }, // Red
  { base: '#FFE0B2', spots: '#FFCC80', glow: 'rgba(255, 204, 128, 0.7)' }, // Orange
  { base: '#B3E5FC', spots: '#81D4FA', glow: 'rgba(129, 212, 250, 0.7)' }, // Light Blue
];

const PresentBox: React.FC<PresentBoxProps> = ({ id, votes, onVote, isLoggedIn, rank }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Get a consistent color for each egg based on its ID
  const colorIndex = (id - 1) % eggColors.length;
  const eggColor = eggColors[colorIndex];
  
  // Determine if this is a top-ranked egg
  const isTopRanked = rank !== undefined && rank <= 3;
  
  // Crown emoji for top eggs
  const getRankEmoji = () => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };
  
  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
        isHovered ? 'transform scale-105' : ''
      } ${isPressed ? 'transform scale-95' : ''} ${
        isTopRanked ? 'border-2 border-yellow-400' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {/* Permanent glow for top ranked eggs, hover glow for others */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
        isTopRanked ? 'opacity-100' : (isHovered ? 'opacity-100' : 'opacity-0')
      }`} style={{
        boxShadow: `0 0 25px 8px ${eggColor.glow}`,
        zIndex: -1
      }}></div>
      
      {/* Top rank badge */}
      {isTopRanked && (
        <div className="absolute top-2 right-2 z-20 text-2xl animate-bounce">
          {getRankEmoji()}
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
            Mystery Egg #{id}
          </h3>
          <div className={`flex items-center justify-center min-w-[60px] h-8 ${
            votes > 0 
              ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200' 
              : 'bg-white border border-gray-200'
          } rounded-full shadow-sm`}>
            <span className={`text-sm font-bold ${
              votes > 0 ? 'text-yellow-600' : 'text-gray-400'
            }`}>
              {votes}
            </span>
          </div>
        </div>
        
        <div className="flex justify-center py-4">
          {/* 3D Egg */}
          <div className="relative w-36 h-40 flex items-center justify-center transform transition-transform duration-300 hover:rotate-3">
            {/* Egg shape */}
            <div className="absolute w-28 h-36 rounded-full" style={{
              backgroundColor: eggColor.base,
              transform: 'scaleY(1.3)',
              boxShadow: `
                inset -8px -8px 12px rgba(0,0,0,0.1),
                inset 8px 8px 12px rgba(255,255,255,0.7),
                5px 5px 15px rgba(0,0,0,0.15)
              `
            }}></div>
            
            {/* Egg spots/patterns - using deterministic positions based on egg ID */}
            {Array.from({ length: 6 }).map((_, i) => {
              // Deterministic positions for spots based on egg ID and spot index
              // Using a simple hash function to generate consistent values
              const hash = (id * (i + 1) * 13) % 100;
              const top = 20 + (hash % 60);
              const left = 20 + ((hash * 7) % 60);
              const size = 4 + ((hash * 3) % 8);
              
              return (
                <div 
                  key={i} 
                  className="absolute rounded-full" 
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: eggColor.spots
                  }}
                ></div>
              );
            })}
            
            {/* Sparkle effects */}
            {(isHovered || isTopRanked) && (
              <>
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </>
            )}
            
            {/* Question mark */}
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <span className="text-gray-600 text-4xl font-bold" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>?</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={() => onVote(id)}
            disabled={!isLoggedIn}
            className={`w-full py-3 px-4 rounded-xl transition-all duration-300 font-medium text-center ${
              isLoggedIn 
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 shadow-md hover:shadow-lg transform hover:-translate-y-1' 
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            {isLoggedIn ? '🥚 Vote' : 'Connect wallet to vote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentBox;
