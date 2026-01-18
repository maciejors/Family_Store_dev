import React from 'react';
import '@/globals.css';
import { Rubik } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
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

	return (
		<html lang="en">
			<body className={font.className}>
				<NextIntlClientProvider>
					<ClientWrapper>{children}</ClientWrapper>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
