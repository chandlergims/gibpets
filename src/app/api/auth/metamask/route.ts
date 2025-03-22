import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Check if user exists
    const existingUser = await usersCollection.findOne({ walletAddress: address });

    if (existingUser) {
      // User exists, update last login
      await usersCollection.updateOne(
        { walletAddress: address },
        { $set: { lastLogin: new Date() } }
      );

      return NextResponse.json({
        message: 'User logged in successfully',
        user: {
          id: existingUser._id,
          walletAddress: existingUser.walletAddress,
          createdAt: existingUser.createdAt,
          lastLogin: new Date(),
        },
      });
    } else {
      // User doesn't exist, create new user
      const newUser = {
        walletAddress: address,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      const result = await usersCollection.insertOne(newUser);

      return NextResponse.json({
        message: 'User registered successfully',
        user: {
          id: result.insertedId,
          walletAddress: address,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Error in MetaMask auth API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
