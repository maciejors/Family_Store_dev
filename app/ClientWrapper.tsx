'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from './shared/store/store';

export interface ClientWrapperProps {
	children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
	return <Provider store={store}>{children}</Provider>;
}
