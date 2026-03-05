import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Si está en /admin/login y YA autenticado → ir al dashboard
    if (req.nextUrl.pathname === '/admin/login' && session) {
        return NextResponse.redirect(new URL('/admin/products', req.url));
    }

    // Si está en /admin/* (excepto login) y NO autenticado → ir al login
    if (req.nextUrl.pathname.startsWith('/admin') &&
        req.nextUrl.pathname !== '/admin/login' &&
        !session) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*'],
};