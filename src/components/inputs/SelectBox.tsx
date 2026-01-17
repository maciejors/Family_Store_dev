import React, { forwardRef, ReactElement } from 'react';
import InputBoxWrapper from './util/InputBoxWrapper';
import SharedInputBoxProps from './util/SharedInputBoxProps';

export type SelectBoxProps<T> = Pick<
	React.SelectHTMLAttributes<HTMLSelectElement>,
	'onChange' | 'onBlur'
> &
	SharedInputBoxProps & {
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
		<InputBoxWrapper compact={compact} label={label} error={error}>
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
		</InputBoxWrapper>
	);
}

const SelectBox = forwardRef(selectBoxRenderFunc) as <T>(
	p: SelectBoxProps<T>,
	ref?: React.Ref<HTMLSelectElement>
) => ReactElement<any>;

export default SelectBox;
