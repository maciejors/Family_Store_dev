import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';

export function setupComponent(component: ReactElement<any>) {
	return new RenderBuilder(component);
}

class RenderBuilder {
	private currentComponent: ReactElement<any>;

	constructor(component: ReactElement<any>) {
		this.currentComponent = component;
	}

	render(): RenderResult {
		return render(this.currentComponent);
	}

	applyWrapper(wrapper: (component: ReactElement<any>) => ReactElement<any>) {
		this.currentComponent = wrapper(this.currentComponent);
		return this;
	}

	applyQueryClient() {
		const queryClient = new QueryClient();
		return this.applyWrapper((component) => (
			<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
		));
	}

	applyLocale(locale: string = 'en') {
		const messages = require(`@/i18n/messages/${locale}.json`);
		return this.applyWrapper((component) => (
			<NextIntlClientProvider messages={messages} locale={locale}>
				{component}
			</NextIntlClientProvider>
		));
	}
}
