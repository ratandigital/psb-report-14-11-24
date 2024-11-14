// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.headers.append(
    'Set-Cookie',
    `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
  ); // Clears the session cookie
  return response;
}
