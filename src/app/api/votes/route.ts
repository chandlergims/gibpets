import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET endpoint to retrieve all votes
export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const votesCollection = db.collection('votes');
    const eggsCollection = db.collection('eggs');

    // Get all eggs with their vote counts
    const eggs = await eggsCollection.find({}).toArray();
    
    // If no eggs exist yet, initialize them
    if (eggs.length === 0) {
      const initialEggs = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        votes: 0,
        createdAt: new Date()
      }));
      
      await eggsCollection.insertMany(initialEggs);
      return NextResponse.json({ eggs: initialEggs });
    }
    
    return NextResponse.json({ eggs });
  } catch (error) {
    console.error('Error retrieving votes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to submit a vote
export async function POST(request: NextRequest) {
  try {
    const { eggId, walletAddress } = await request.json();

    if (!eggId || !walletAddress) {
      return NextResponse.json(
        { error: 'Egg ID and wallet address are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const votesCollection = db.collection('votes');
    const eggsCollection = db.collection('eggs');
    const usersCollection = db.collection('users');

    // Check if user exists, create if not
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
      
      console.log('Created new user:', user);
    }

    // Check if user has already voted
    const existingVote = await votesCollection.findOne({ 
      userId: user._id,
      // We could add a roundId here if we want to track voting rounds
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted in this round', existingVote },
        { status: 400 }
      );
    }

    // Convert eggId to number to ensure consistent type
    const eggIdNum = Number(eggId);
    
    // Find the egg
    const egg = await eggsCollection.findOne({ id: eggIdNum });
    if (!egg) {
      // If egg doesn't exist, create it
      await eggsCollection.insertOne({
        id: eggIdNum,
        votes: 0,
        createdAt: new Date()
      });
    }

    // Record the vote
    const vote = {
      userId: user._id,
      eggId: eggIdNum,
      createdAt: new Date(),
      // roundId: currentRoundId, // For future implementation of rounds
    };

    await votesCollection.insertOne(vote);

    // Increment the egg's vote count
    await eggsCollection.updateOne(
      { id: eggIdNum },
      { $inc: { votes: 1 } }
    );

    // Get updated egg data
    const updatedEgg = await eggsCollection.findOne({ id: eggIdNum });
    
    // Get all eggs with their updated vote counts
    const allEggs = await eggsCollection.find({}).toArray();

    return NextResponse.json({
      message: 'Vote recorded successfully',
      vote,
      egg: updatedEgg,
      allEggs
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
