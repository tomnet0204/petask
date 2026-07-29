import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/petask/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const animal = searchParams.get('animal');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const offset = parseInt(searchParams.get('offset') ?? '0');

  const supabase = createServerSupabase();

  if (!supabase) {
    return NextResponse.json({ questions: [], total: 0, isMock: true });
  }

  let query = supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (animal) query = query.eq('animal_type', animal);
  if (status) query = query.eq('status', status);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ questions: data, total: count });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { petName, animalType, ageYears, sex, symptomSlug, questionBody, userEmail, checkerResult } = body;

  if (!petName || !animalType || !questionBody) {
    return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
  }
  if (questionBody.length < 10) {
    return NextResponse.json({ error: '質問は10文字以上で入力してください' }, { status: 400 });
  }

  const supabase = createServerSupabase();

  if (!supabase) {
    return NextResponse.json({
      id: 'mock-' + Date.now(),
      isMock: true,
      message: '質問を受け付けました（デモモード）',
    });
  }

  const { data, error } = await supabase
    .from('questions')
    .insert({
      pet_name: petName,
      animal_type: animalType,
      age_years: ageYears,
      sex,
      body: questionBody,
      symptom_slug: symptomSlug,
      checker_result: checkerResult,
      user_email: userEmail,
      status: 'pending',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id, message: '質問を受け付けました' });
}
