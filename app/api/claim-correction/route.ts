import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      role,
      relationship,
      correction,
      solarParkName,
      solarParkLocation,
      currentStatus
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // For now, just log the submission (in production, you'd email this)
    console.log('=== Grazing Status Claim/Correction Submission ===');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Role: ${role}`);
    console.log(`Relationship: ${relationship}`);
    console.log(`Solar Park: ${solarParkName}`);
    console.log(`Location: ${solarParkLocation}`);
    console.log(`Current Status: ${currentStatus}`);
    console.log(`Correction Request: ${correction}`);
    console.log('==================================================');

    // In a real implementation, you would send an email here
    // For example using nodemailer or a service like SendGrid

    return NextResponse.json(
      { message: 'Submission received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing claim/correction submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}