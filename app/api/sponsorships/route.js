import dbConnect from '../../../lib/mongodb';
import Sponsorship from '../../../models/Sponsorship';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const sponsorId = searchParams.get('sponsorId');

        let query = { status: 'open' };

        if (sponsorId) {
            query = { sponsorId }; // Show all for sponsor
        }

        const sponsorships = await Sponsorship.find(query).sort({ createdAt: -1 });
        return NextResponse.json(sponsorships);
    } catch (error) {
        console.error("Error fetching sponsorships:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();

        // Validate
        if (!data.sponsorId || !data.title || !data.budget) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const sponsorship = await Sponsorship.create(data);
        return NextResponse.json({ success: true, id: sponsorship._id });
    } catch (error) {
        console.error("Error creating sponsorship:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
