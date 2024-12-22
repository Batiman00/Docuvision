import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(loginUrl); 
  }

  const response = NextResponse.next();
  response.headers.set('x-user', JSON.stringify(token));
  return response;
}

export const config = {
  matcher: ['/chat/:path*'], // Match routes under "/chat/" with any subpath
};
