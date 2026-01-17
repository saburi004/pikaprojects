import dbConnect from '../../../../lib/mongodb';
import Sponsorship from '../../../../models/Sponsorship';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const sponsorship = await Sponsorship.findById(id).populate('sponsorId', 'displayName email');

        if (!sponsorship) {
            return NextResponse.json({ error: 'Sponsorship not found' }, { status: 404 });
        }

        return NextResponse.json(sponsorship);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const sponsorship = await Sponsorship.findByIdAndUpdate(id, body, { new: true });

        if (!sponsorship) {
            return NextResponse.json({ error: 'Sponsorship not found' }, { status: 404 });
        }

        return NextResponse.json(sponsorship);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
