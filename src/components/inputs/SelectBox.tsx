import React, { forwardRef, ReactElement } from 'react';
import InputWrapper from './util/InputWrapper';
import SharedTextboxProps from './util/SharedTextboxProps';

export type SelectBoxProps<T> = Pick<
	React.SelectHTMLAttributes<HTMLSelectElement>,
	'onChange' | 'onBlur'
> &
	SharedTextboxProps & {
		options: T[];
		keyMapper?: (option: T) => React.Key;
		valueMapper: (option: T) => string;
		displayNameMapper?: (option: T) => string;
	};

function selectBoxRenderFunc<T>(
	{
		options,
		keyMapper,
		valueMapper,
		displayNameMapper,
		compact,
		label,
		error,
		...selectProps
	}: SelectBoxProps<T>,
	ref: React.Ref<HTMLSelectElement>
) {
	return (
		<InputWrapper compact={compact} label={label} error={error}>
			<select ref={ref} {...selectProps}>
				{options.map((opt) => {
					const value = valueMapper(opt);
					const key = keyMapper ? keyMapper(opt) : value;
					const name = displayNameMapper ? displayNameMapper(opt) : value;
					return (
						<option key={key} value={value}>
							{name}
						</option>
					);
				})}
			</select>
		</InputWrapper>
	);
}

const SelectBox = forwardRef(selectBoxRenderFunc) as <T>(
	p: SelectBoxProps<T>,
	ref?: React.Ref<HTMLSelectElement>
) => ReactElement;

export default SelectBox;
