import { ReactNode } from 'react';

export type ErrorLabelProps = {
	children: ReactNode;
};

export default function ErrorLabel({ children }: ErrorLabelProps) {
	return <p className="text-sm text-md-red-500">{children}</p>;
}
