import { NextRequest, NextResponse } from 'next/server';
import { recommendProduct } from '@/lib/recommendation';
import { QuestionnaireAnswers } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QuestionnaireAnswers;
    const recommendation = recommendProduct(body);
    return NextResponse.json(recommendation);
  } catch {
    return NextResponse.json({ error: 'Invalid recommendation request.' }, { status: 400 });
  }
}
