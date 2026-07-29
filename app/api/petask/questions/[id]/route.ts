import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/petask/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerSupabase();

  if (!supabase) {
    return NextResponse.json({ question: null, answers: [], isMock: true });
  }

  const { data: question, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const { data: answers } = await supabase
    .from('answers')
    .select('*, vets(*)')
    .eq('question_id', id)
    .order('created_at', { ascending: true });

  return NextResponse.json({ question, answers: answers ?? [] });
}
