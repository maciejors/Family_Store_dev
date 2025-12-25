'use client';

import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { ReactNode, useEffect } from 'react';
import IconButton from '@/components/buttons/IconButton';
import Card from '../Card';
import Overlay from '../Overlay';
import clsx from 'clsx';

export type DialogProps = {
	open: boolean;
	handleClose: VoidFunction;
	title: string;
	children?: ReactNode;
	className?: string;
};

export default function Dialog({
	children,
	open,
	handleClose,
	title,
	className,
}: DialogProps) {
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
				<Card className={clsx('p-2 z-10 overflow-y-auto', className)}>
					<header className="flex justify-between gap-4 items-start">
						<h3>{title}</h3>
						<IconButton
							onClick={handleClose}
							icon={<Icon path={mdiClose} size={1.5} />}
							aria-label="Close"
						/>
					</header>
					{children}
				</Card>
			</Overlay>
		)
	);
}
