import { NextResponse } from 'next/server';
import { getVets } from '@/lib/petask/db/vets';

export async function GET() {
  try {
    const vets = await getVets();
    return NextResponse.json({ vets });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
