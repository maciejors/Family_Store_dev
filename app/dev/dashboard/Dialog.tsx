'use client';

import './dashboard.css';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useState } from 'react';
import React from 'react';

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
			<button onClick={showDialog}>{openButton}</button>
			{visible && (
				<div className="overlay">
					<div className="card dialog">
						<header className="dialog-header">
							<h3>{title}</h3>
							<button onClick={hideDialog} className="close-btn">
								<Icon path={mdiClose} size={1.5} />
							</button>
						</header>
						{children}
					</div>
				</div>
			)}
		</>
	);
}
