import '@/globals.css';
import { routing } from '@/i18n/routing';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { Rubik } from 'next/font/google';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import React from 'react';
import ClientWrapper from './ClientWrapper';

const font = Rubik({ subsets: ['latin-ext'], weight: '400' });

export type RootLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
};

export const metadata = {
	title: 'Family Store Dev',
	description: 'Family Store for App Developers',
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
	const { lang } = await params;
	if (!hasLocale(routing.locales, lang)) {
		notFound();
	}

	const requestCookies = await cookies();
	const theme = requestCookies.get('theme')?.value;
	const dataTheme = theme === 'light' || theme === 'dark' ? theme : undefined;

	return (
		<html lang={lang} data-theme={dataTheme}>
			<body className={font.className}>
				<NextIntlClientProvider>
					<ClientWrapper>{children}</ClientWrapper>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
