import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoggedIn = !!req.auth;

  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL('/admin-login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

// Chỉ chạy middleware trên route admin — tránh tốn hiệu năng ở route public
export const config = {
  matcher: ['/admin/:path*'],
};
