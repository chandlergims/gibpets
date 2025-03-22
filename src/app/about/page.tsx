'use client';

import React from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            <span className="block text-yellow-600">About BNBark</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Creating a sustainable ecosystem of cute dog memecoins on four.meme
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How BNBark Works</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-yellow-50 rounded-full p-4 flex items-center justify-center w-16 h-16 flex-shrink-0">
                <span className="text-2xl">🥚</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Daily Voting Rounds</h3>
                <p className="text-gray-600">
                  Every day, 20 mystery eggs are presented to the community. Each egg contains a unique, 
                  algorithmically generated dog that will be revealed after the voting period ends. 
                  Connect your wallet to cast your vote for your favorite egg!
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-yellow-50 rounded-full p-4 flex items-center justify-center w-16 h-16 flex-shrink-0">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Tokenization Process</h3>
                <p className="text-gray-600">
                  When the countdown timer reaches zero, the egg with the most votes hatches, revealing 
                  the cute dog inside. This dog will automatically become a token on four.meme on the BNB Chain and 
                  becomes part of the growing BNBark ecosystem. Every voter who voted for the winning egg will 
                  get airdropped supply automatically when the dog is tokenized.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-yellow-50 rounded-full p-4 flex items-center justify-center w-16 h-16 flex-shrink-0">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Sustainable Ecosystem</h3>
                <p className="text-gray-600">
                  After each tokenization, a new voting round begins automatically with fresh eggs. 
                  This creates a sustainable ecosystem where new dogs are continuously born into the 
                  BNBark universe. Each dog has unique traits, personalities, and characteristics, 
                  making every memecoin token special and valuable to the community.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-yellow-50 rounded-full p-4 flex items-center justify-center w-16 h-16 flex-shrink-0">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Benefits</h3>
                <p className="text-gray-600">
                  As the BNBark ecosystem grows, so does its value and utility. Dog token holders gain 
                  access to exclusive features, events, and future developments in the ecosystem. 
                  By participating in the voting process, you'll automatically receive token airdrops 
                  when your chosen egg wins. The community plays a vital role in shaping the future 
                  of BNBark through voting and participation.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Vision</h2>
            <p className="text-gray-600 mb-4">
              BNBark aims to create a vibrant, self-sustaining ecosystem of digital pets on the blockchain. 
              By combining cute, collectible artwork with community participation and tokenomics, we're 
              building more than just a memecoin project—we're creating a digital pet universe that grows 
              and evolves over time on four.meme.
            </p>
            <p className="text-gray-600">
              Each dog in the BNBark ecosystem is unique and becomes part of the ever-expanding family. 
              As the ecosystem grows, we plan to introduce more features, interactions, and utilities 
              for your digital pet tokens.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-yellow-500 text-white font-medium rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-200"
            >
              Join the BNBark Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
