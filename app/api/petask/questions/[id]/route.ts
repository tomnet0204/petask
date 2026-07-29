import { NextRequest, NextResponse } from 'next/server';
import { getQuestionById } from '@/lib/petask/db/questions';
import { getAnswersByQuestionId } from '@/lib/petask/db/answers';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const question = await getQuestionById(id);
    if (!question) return NextResponse.json({ error: '質問が見つかりません' }, { status: 404 });
    const answers = await getAnswersByQuestionId(id);
    return NextResponse.json({ question, answers });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
