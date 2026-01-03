import { ReactNode } from 'react';

type SharedInputBoxProps = {
	label?: string | ReactNode;
	error?: string | boolean;
	compact?: boolean;
};

export default SharedInputBoxProps;
