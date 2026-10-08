import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    console.log('✅ New candidate registered:', { name, email });

    return NextResponse.json({
      success: true,
      message: 'Candidate registered successfully',
      data: { name, email }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to register candidate' },
      { status: 500 }
    );
  }
}
