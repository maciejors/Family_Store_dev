import React, { forwardRef } from 'react';
import InputWrapper from './util/InputWrapper';
import SharedTextboxProps from './util/SharedTextboxProps';

export type TextAreaProps = Pick<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	'onChange' | 'onBlur' | 'rows' | 'cols'
> &
	SharedTextboxProps;

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
	{ compact, label, error, ...textAreaProps },
	ref
) {
	return (
		<InputWrapper compact={compact} label={label} error={error}>
			<textarea ref={ref} {...textAreaProps} />
		</InputWrapper>
	);
});

export default TextArea;
