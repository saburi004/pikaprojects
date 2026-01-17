import dbConnect from '../../../lib/mongodb';
import Project from '../../../models/Project';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    let query = { status: 'available' };

    // If sellerId is provided, we might want to show filters, but usually sellers want to see THEIR projects regardless of status
    if (sellerId) {
      query = { sellerId }; // Override to show all for seller
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Validate required fields (basic)
    if (!data.sellerId || !data.title || !data.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const project = await Project.create(data);
    return NextResponse.json({ success: true, id: project._id });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}