import React, { ReactNode } from 'react';
import Card from './wrappers/Card';

export type MessagePageProps = {
	title: string;
	children?: ReactNode;
};

export default function MessagePage({ title, children }: MessagePageProps) {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<Card className="p-8 max-w-md flex flex-col gap-4 items-center">
				<h2 className="text-center">{title}</h2>
				{children}
			</Card>
		</div>
	);
}
