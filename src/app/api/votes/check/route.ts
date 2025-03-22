import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const votesCollection = db.collection('votes');

    // Find the user, create if not exists
    let user = await usersCollection.findOne({ walletAddress });
    
    if (!user) {
      // Create a new user
      const newUser = {
        walletAddress,
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      
      const result = await usersCollection.insertOne(newUser);
      user = {
        _id: result.insertedId,
        ...newUser
      };
      
      console.log('Created new user in check endpoint:', user);
      
      // New user has not voted
      return NextResponse.json({
        hasVoted: false,
        message: 'New user created, has not voted yet'
      });
    }

    // Check if user has already voted
    const existingVote = await votesCollection.findOne({ 
      userId: user._id,
      // We could add a roundId here if we want to track voting rounds
    });

    if (existingVote) {
      return NextResponse.json({
        hasVoted: true,
        eggId: Number(existingVote.eggId),
        message: 'User has already voted'
      });
    }

    return NextResponse.json({
      hasVoted: false,
      message: 'User has not voted yet'
    });
  } catch (error) {
    console.error('Error checking vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
