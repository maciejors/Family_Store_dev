import React, { forwardRef } from 'react';
import InputWrapper from './util/InputWrapper';
import SharedTextboxProps from './util/SharedTextboxProps';

export type TextInputProps = Pick<
	React.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'onChange' | 'onBlur' | 'placeholder'
> &
	SharedTextboxProps & {
		type?: 'text' | 'email' | 'password';
	};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
	{ type = 'text', compact, label, error, ...inputProps },
	ref
) {
	return (
		<InputWrapper compact={compact} label={label} error={error}>
			<input ref={ref} type={type} {...inputProps} />
		</InputWrapper>
	);
});

export default TextInput;
