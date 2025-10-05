import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import btnStyles from './buttons.module.css';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary';
};

export default function Button({
	variant = 'primary',
	className,
	children,
	...otherProps
}: ButtonProps) {
	return (
		<button
			className={clsx(btnStyles.btn, btnStyles[`btn-${variant}`], className)}
			{...otherProps}
		>
			{children}
		</button>
	);
}
