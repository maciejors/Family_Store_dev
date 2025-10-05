import React, { ReactNode } from 'react';

export type OverlayProps = {
	children?: ReactNode;
};

export default function Overlay({ children }: OverlayProps) {
	return (
		<div className="bg-gray-600/50 fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center p-4">
			{children}
		</div>
	);
}
