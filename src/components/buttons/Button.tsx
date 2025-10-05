import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import btnStyles from './buttons.module.css';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary';
	component?: 'button' | 'span';
};

export default function Button({
	variant = 'primary',
	component = 'button',
	className,
	children,
	...otherProps
}: ButtonProps) {
	const Component = component;
	return (
		<Component
			className={clsx(
				btnStyles.btn,
				btnStyles[`btn-${variant}`],
				'py-1 px-2 border-2 border-solid rounded-lg',
				className
			)}
			{...otherProps}
		>
			{children}
		</Component>
	);
}
