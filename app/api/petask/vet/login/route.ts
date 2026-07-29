import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/petask/supabase';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'メールアドレスとパスワードが必要です' }, { status: 400 });
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase未設定' }, { status: 503 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: 'メールアドレスまたはパスワードが正しくありません' }, { status: 401 });
  }

  return NextResponse.json({ userId: data.user.id, email: data.user.email });
}
