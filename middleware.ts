import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value || null;

  const protectedRoutes = ['/dashboard'];

  if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Middleware hanya berlaku untuk route tertentu
export const config = {
  matcher: ['/dashboard/:path*'],
};
