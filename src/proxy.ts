// nextjs.org/docs/app/guides/internationalization
import { NextResponse, NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const availableLocales = ['en', 'pl'];

function getLocale(request: NextRequest) {
	const headers = Object.fromEntries(request.headers.entries());
	const browserLaguages = new Negotiator({ headers }).languages();
	const defaultLocale = 'en';
	return match(browserLaguages, availableLocales, defaultLocale);
}

export function proxy(request: NextRequest) {
	// Check if there is any supported locale in the pathname
	const { pathname } = request.nextUrl;
	const pathnameHasLocale = availableLocales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);

	if (pathnameHasLocale) return;

	// Redirect if there is no locale
	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;

	// e.g. incoming request is /products
	// The new URL is now /en-US/products
	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	matcher: [
		// Skip calls to api, internal paths, and images
		'/((?!api|_next|.*\\.png$).*)',
	],
};
