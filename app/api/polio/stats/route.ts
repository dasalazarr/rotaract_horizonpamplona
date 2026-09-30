import { NextResponse } from 'next/server';
import { polioStore } from '@/lib/polio/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const store = polioStore();
    return NextResponse.json(
      { count: await store.count(), mode: await store.getMode() },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
    );
  } catch {
    return NextResponse.json({ count: 0, mode: 'expectativa' }, { status: 503 });
  }
}
