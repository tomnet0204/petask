import { NextRequest, NextResponse } from 'next/server';
import { getQuestions, createQuestion } from '@/lib/petask/db/questions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  try {
    const questions = await getQuestions({
      animal: searchParams.get('animal') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      limit: parseInt(searchParams.get('limit') ?? '10'),
      offset: parseInt(searchParams.get('offset') ?? '0'),
    });
    return NextResponse.json({ questions, total: questions.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が不正です' }, { status: 400 });
  }

  const { petName, animalType, ageYears, sex, symptomSlug, questionBody, userEmail, checkerResult } = body as {
    petName?: string; animalType?: string; ageYears?: number; sex?: string;
    symptomSlug?: string; questionBody?: string; userEmail?: string; checkerResult?: unknown;
  };

  if (!petName || !animalType || !questionBody) {
    return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
  }
  if (questionBody.length < 10) {
    return NextResponse.json({ error: '質問は10文字以上で入力してください' }, { status: 400 });
  }
  if (!['dog', 'cat'].includes(animalType)) {
    return NextResponse.json({ error: 'animalTypeはdogまたはcatを指定してください' }, { status: 400 });
  }

  try {
    const question = await createQuestion({
      petName,
      animalType: animalType as 'dog' | 'cat',
      ageYears: ageYears ? Number(ageYears) : undefined,
      sex: (sex as 'male' | 'female' | 'unknown') ?? 'unknown',
      body: questionBody,
      symptomSlug: symptomSlug ?? undefined,
      checkerResult: checkerResult as never,
      userEmail: userEmail ?? undefined,
    });
    return NextResponse.json(
      { id: question.id, petName: question.petName, animalType: question.animalType, status: question.status, message: '質問を受け付けました' },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
