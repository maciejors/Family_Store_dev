import { ButtonHTMLAttributes, ReactElement } from 'react';
import clsx from 'clsx';
import btnStyles from './buttons.module.css';

export type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	startIcon?: ReactElement<any>;
	component?: 'button' | 'span';
};

export default function TextButton({
	startIcon,
	component = 'button',
	className,
	children,
	...otherProps
}: TextButtonProps) {
	const Component = component;
	return (
		<Component
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
		</Component>
	);
}
