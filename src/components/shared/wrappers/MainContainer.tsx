import { ReactNode } from 'react';
import clsx from 'clsx';

export type MainContainerProps = {
	children?: ReactNode;
	fillScreen?: boolean;
};

export default function MainContainer({
	children,
	fillScreen = false,
}: MainContainerProps) {
	return (
		<div
			className={clsx(
				'flex flex-col justify-center items-center',
				'w-full px-2 sm:px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-48',
				fillScreen && 'h-screen'
			)}
		>
			{children}
		</div>
	);
}
