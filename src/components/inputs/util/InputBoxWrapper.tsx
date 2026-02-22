import clsx from 'clsx';
import { cloneElement, ReactElement, useId } from 'react';
import GenericInputWrapper from './GenericInputWrapper';
import SharedInputBoxProps from './SharedInputBoxProps';

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
		'bg-md-grey-100 dark:bg-md-grey-800/50 border rounded-md focus:outline-hidden shadow-inner w-full min-w-0',
		!compact && 'py-1 px-2',
		error ? 'border-md-red-500' : 'border-md-grey-300 dark:border-md-grey-800'
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
