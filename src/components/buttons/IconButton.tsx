import { ButtonHTMLAttributes, ReactElement } from 'react';
import clsx from 'clsx';
import btnStyles from './buttons.module.css';

export type IconButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'children'
> & {
	icon: ReactElement<any>;
	component?: 'button' | 'span';
	color?: 'text' | 'primary';
};

export default function IconButton({
	icon,
	component = 'button',
	color = 'text',
	className,
	...otherProps
}: IconButtonProps) {
	const Component = component;
	return (
		<Component
			className={clsx(btnStyles.btn, btnStyles[`icon-button-color-${color}`], className)}
			{...otherProps}
		>
			{icon}
		</Component>
	);
}
