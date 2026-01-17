import dbConnect from '../../../lib/mongodb';
import Application from '../../../models/Application';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const developerId = searchParams.get('developerId');
        const sponsorshipId = searchParams.get('sponsorshipId');

        let query = {};

        if (developerId) {
            query.developerId = developerId;
        } else if (sponsorshipId) {
            query.sponsorshipId = sponsorshipId;
        }

        const applications = await Application.find(query).sort({ createdAt: -1 });
        return NextResponse.json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();

        if (!data.sponsorshipId || !data.developerId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const application = await Application.create(data);
        return NextResponse.json({ success: true, id: application._id });
    } catch (error) {
        console.error("Error creating application:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
