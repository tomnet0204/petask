import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/petask/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { questionId, answerBody, vetId } = body;

  if (!questionId || !answerBody || !vetId) {
    return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
  }
  if (answerBody.length < 20) {
    return NextResponse.json({ error: '回答は20文字以上で入力してください' }, { status: 400 });
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ id: 'mock-ans-' + Date.now(), isMock: true });
  }

  const { data, error } = await supabase
    .from('answers')
    .insert({ question_id: questionId, vet_id: vetId, body: answerBody })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
