import { ButtonHTMLAttributes, ReactElement } from 'react';
import clsx from 'clsx';
import btnStyles from './buttons.module.css';

export type IconButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'children'
> & {
	icon: ReactElement;
	component?: 'button' | 'span';
};

export default function IconButton({
	icon,
	component = 'button',
	className,
	...otherProps
}: IconButtonProps) {
	const Component = component;
	return (
		<Component
			className={clsx(btnStyles.btn, 'hover:text-gray-700', className)}
			{...otherProps}
		>
			{icon}
		</Component>
	);
}
