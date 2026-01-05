import React, { forwardRef } from 'react';
import InputBoxWrapper from './util/InputBoxWrapper';
import SharedInputBoxProps from './util/SharedInputBoxProps';

export type TextInputProps = Pick<
	React.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'onChange' | 'onBlur' | 'placeholder'
> &
	SharedInputBoxProps & {
		type?: 'text' | 'email' | 'password';
	};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
	{ type = 'text', compact, label, error, ...inputProps },
	ref
) {
	return (
		<InputBoxWrapper compact={compact} label={label} error={error}>
			<input ref={ref} type={type} {...inputProps} />
		</InputBoxWrapper>
	);
});

export default TextInput;
