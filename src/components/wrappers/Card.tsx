import clsx from 'clsx';
import { ReactNode } from 'react';

export type CardProps = {
	className?: string;
	children?: ReactNode;
};

export default function Card({ className, children }: CardProps) {
	return (
		<div
			className={clsx(
				'not-dark:shadow-lg dark:shadow-md dark:shadow-black/25 rounded-md bg-white dark:bg-md-grey-900 transition-colors',
				className
			)}
		>
			{children}
		</div>
	);
}
