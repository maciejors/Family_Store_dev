'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from '../store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export type ClientWrapperProps = {
	children: ReactNode;
};

export default function ClientWrapper({ children }: ClientWrapperProps) {
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</Provider>
	);
}
