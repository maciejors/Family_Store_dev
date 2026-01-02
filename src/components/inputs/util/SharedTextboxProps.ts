import { ReactNode } from 'react';

type SharedTextboxProps = {
	label?: string | ReactNode;
	error?: string | boolean;
	compact?: boolean;
};

export default SharedTextboxProps;
