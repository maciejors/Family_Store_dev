import { ReactNode } from 'react';
import ErrorLabel from './ErrorLabel';

export type GenericInputWrapperProps = {
	children: ReactNode;
	label?: string | ReactNode;
	error?: string | boolean;
	labelHtmlFor?: string;
};

export default function GenericInputWrapper({
	children,
	label,
	error,
	labelHtmlFor,
}: GenericInputWrapperProps) {
	return (
		<div className="flex flex-col w-full">
			{label && <label htmlFor={labelHtmlFor}>{label}</label>}
			{children}
			{error && error !== true && <ErrorLabel>{error}</ErrorLabel>}
		</div>
	);
}
