'use client';

import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useState } from 'react';
import React from 'react';
import IconButton from './buttons/IconButton';

export default function Dialog({ children, openButton, title }) {
	const [visible, setVisible] = useState(false);

	function showDialog() {
		setVisible(true);
		document.body.style.overflowY = 'hidden';
	}

	function hideDialog() {
		setVisible(false);
		document.body.style.overflowY = 'auto';
	}

	return (
		<>
			<div onClick={showDialog}>{openButton}</div>
			{visible && (
				<div className="bg-gray-600/50 fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center p-4">
					<div className="card bg-gray-50 w-fit h-fit p-2 z-10 overflow-y-auto">
						<header className="flex justify-between gap-4 items-start">
							<h3>{title}</h3>
							<IconButton
								onClick={hideDialog}
								icon={<Icon path={mdiClose} size={1.5} />}
							/>
						</header>
						{children}
					</div>
				</div>
			)}
		</>
	);
}
