import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.headers.set(
    'Set-Cookie',
    'admin_session=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400'
  );
  return response;
}
