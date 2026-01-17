import dbConnect from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        // Note: params needed to be awaited as per Next 15 in some contexts, but let's be safe
        // Actually in App Router params is a promise in newer versions, but usually destructured via use(params) in client or direct in server. 
        // In API routes, context.params is the object.

        const project = await Project.findById(id).populate('sellerId', 'displayName email');

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const project = await Project.findByIdAndUpdate(id, body, { new: true });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
