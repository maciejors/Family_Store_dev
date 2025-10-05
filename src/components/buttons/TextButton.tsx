import { ButtonHTMLAttributes, ReactElement } from 'react';
import clsx from 'clsx';
import btnStyles from './buttons.module.css';

export type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	startIcon?: ReactElement;
};

export default function TextButton({
	startIcon,
	className,
	children,
	...otherProps
}: TextButtonProps) {
	return (
		<button
			className={clsx(
				btnStyles.btn,
				'text-primary text-lg hover:underline',
				'flex flex-row items-center',
				className
			)}
			{...otherProps}
		>
			{startIcon}
			<span>{children}</span>
		</button>
	);
}
