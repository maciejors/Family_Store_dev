import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function setupComponent(component: ReactElement) {
	return new RenderBuilder(component);
}

class RenderBuilder {
	private currentComponent: ReactElement;

	constructor(component: ReactElement) {
		this.currentComponent = component;
	}

	render(): RenderResult {
		return render(this.currentComponent);
	}

	applyWrapper(wrapper: (component: ReactElement) => ReactElement) {
		this.currentComponent = wrapper(this.currentComponent);
		return this;
	}

	applyQueryClient() {
		const queryClient = new QueryClient();
		return this.applyWrapper((component) => (
			<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
		));
	}
}
