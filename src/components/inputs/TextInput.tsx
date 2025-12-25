import React, { useId, forwardRef } from 'react';

export type TextInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'id' | 'className'
> & {
	label?: string;
	error?: string;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
	{ label, error, ...inputProps },
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
				className="bg-gray-100 border border-gray-300 rounded-md py-2 px-4 focus:outline-hidden w-full"
				id={id}
			/>
			{error && <p className="text-sm text-red-700">{error}</p>}
		</div>
	);
});

export default TextInput;
