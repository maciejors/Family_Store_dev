import { ReactNode } from 'react';
import clsx from 'clsx';

export type CardProps = {
	className?: string;
	children?: ReactNode;
};

export default function Card({ className, children }: CardProps) {
	return (
		<div className={clsx('shadow-lg rounded-md bg-white transition-colors', className)}>
			{children}
		</div>
	);
}
