import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/petask/supabase';

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerSupabase();

  if (!supabase) {
    return NextResponse.json({ ok: true, isMock: true });
  }

  const { data: answer, error: fetchErr } = await supabase
    .from('answers').select('question_id').eq('id', id).single();
  if (fetchErr || !answer) {
    return NextResponse.json({ error: '回答が見つかりません' }, { status: 404 });
  }

  const questionId = answer.question_id;

  await supabase.from('answers')
    .update({ is_accepted: false })
    .eq('question_id', questionId);

  const { error } = await supabase.from('answers')
    .update({ is_accepted: true }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('questions')
    .update({ status: 'answered' }).eq('id', questionId);

  return NextResponse.json({ ok: true });
}
