import { cloneElement, ReactElement, useId } from 'react';
import clsx from 'clsx';
import SharedTextboxProps from './SharedTextboxProps';
import ErrorLabel from './ErrorLabel';

export type InputWrapperProps = SharedTextboxProps & {
	children: ReactElement<HTMLElement>;
};

export default function InputWrapper({
	label,
	error,
	compact,
	children,
}: InputWrapperProps) {
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
		<div className="flex flex-col w-full">
			{label && (
				<label className="mt-3" htmlFor={id}>
					{label}
				</label>
			)}
			{child}
			{error && error !== true && <ErrorLabel>{error}</ErrorLabel>}
		</div>
	);
}
