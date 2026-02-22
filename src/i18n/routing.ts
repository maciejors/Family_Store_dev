/**
 * https://next-intl.dev/docs/routing/setup
 */
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	locales: ['en', 'pl'],
	defaultLocale: 'en',
});
