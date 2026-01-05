import React, { forwardRef } from 'react';
import InputBoxWrapper from './util/InputBoxWrapper';
import SharedInputBoxProps from './util/SharedInputBoxProps';

export type TextAreaProps = Pick<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	'onChange' | 'onBlur' | 'rows' | 'cols'
> &
	SharedInputBoxProps;

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
	{ compact, label, error, ...textAreaProps },
	ref
) {
	return (
		<InputBoxWrapper compact={compact} label={label} error={error}>
			<textarea ref={ref} {...textAreaProps} />
		</InputBoxWrapper>
	);
});

export default TextArea;
