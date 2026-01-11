import { cloneElement, ReactElement, useId } from 'react';
import clsx from 'clsx';
import SharedInputBoxProps from './SharedInputBoxProps';
import GenericInputWrapper from './GenericInputWrapper';

export type InputBoxWrapperProps = SharedInputBoxProps & {
	children: ReactElement<HTMLElement>;
};

export default function InputBoxWrapper({
	label,
	error,
	compact,
	children,
}: InputBoxWrapperProps) {
	const id = useId();

	const className = clsx(
		'bg-gray-100 border rounded-md focus:outline-hidden shadow-inner w-full min-w-0',
		!compact && 'py-1 px-2',
		error ? 'border-red-500' : 'border-gray-300'
	);

	const child = cloneElement(children, {
		id,
		className: clsx(children.props.className, className),
	});

	return (
		<GenericInputWrapper labelHtmlFor={id} label={label} error={error}>
			{child}
		</GenericInputWrapper>
	);
}
