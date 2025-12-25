import React, { useId, forwardRef } from 'react';
import clsx from 'clsx';

export type TextInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'id' | 'className'
> & {
	label?: string;
	error?: string | boolean;
	compact?: boolean;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
	{ label, error, compact, ...inputProps },
	ref
) {
	const id = useId();

	return (
		<div className="flex flex-col w-full">
			{label && (
				<label className="mt-3" htmlFor={id}>
					{label}
				</label>
			)}
			<input
				{...inputProps}
				ref={ref}
				className={clsx(
					'bg-gray-100 border rounded-md focus:outline-hidden shadow-inner w-full min-w-0',
					!compact && 'py-2 px-4',
					error ? 'border-red-500' : 'border-gray-300'
				)}
				id={id}
			/>
			{error && error !== true && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
});

export default TextInput;
