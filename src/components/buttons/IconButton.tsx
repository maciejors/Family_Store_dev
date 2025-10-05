import { ButtonHTMLAttributes, ReactElement } from 'react';
import clsx from 'clsx';
import btnStyles from './buttons.module.css';

export type IconButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'children'
> & {
	icon: ReactElement;
};

export default function IconButton({ icon, className, ...otherProps }: IconButtonProps) {
	return (
		<button className={clsx(btnStyles.btn, 'hover:text-gray-700')} {...otherProps}>
			{icon}
		</button>
	);
}
