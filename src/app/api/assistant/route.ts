import { NextRequest, NextResponse } from 'next/server';
import { simulatedAssistant } from '@/lib/assistant';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const question = typeof body.question === 'string' ? body.question : '';
    const response = simulatedAssistant(question);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'Invalid assistant request.' }, { status: 400 });
  }
}
