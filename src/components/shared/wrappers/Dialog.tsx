'use client';

import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { ReactNode, useEffect } from 'react';
import React from 'react';
import IconButton from '../buttons/IconButton';
import Card from './Card';
import Overlay from './Overlay';

export type DialogProps = {
	open: boolean;
	handleClose: VoidFunction;
	title: string;
	children?: ReactNode;
};

export default function Dialog({ children, open, handleClose, title }: DialogProps) {
	function hideScrollbar() {
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		document.body.style.overflowY = 'hidden';
		document.body.style.paddingRight = `${scrollbarWidth}px`;
	}

	function resetScrollbar() {
		document.body.style.overflowY = 'auto';
		document.body.style.paddingRight = '';
	}

	useEffect(() => {
		if (open) hideScrollbar();
		else resetScrollbar();
		return resetScrollbar;
	}, [open]);

	return (
		open && (
			<Overlay>
				<Card className="w-fit h-fit p-2 z-10 overflow-y-auto">
					<header className="flex justify-between gap-4 items-start">
						<h3>{title}</h3>
						<IconButton
							onClick={handleClose}
							icon={<Icon path={mdiClose} size={1.5} />}
						/>
					</header>
					{children}
				</Card>
			</Overlay>
		)
	);
}
