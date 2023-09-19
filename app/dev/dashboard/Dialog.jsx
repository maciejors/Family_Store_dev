'use client';

import './dashboard.css';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useState } from 'react';

export default function Dialog({ children, openButton, title }) {
	const [visible, setVisible] = useState(false);

	function preventDefault(e) {
		e.preventDefault();
	}

	function showDialog(e) {
		e.preventDefault();
		setVisible(true);
		document.body.style.overflowY = 'hidden';
	}

	function hideDialog(e) {
		e.preventDefault();
		setVisible(false);
		document.body.style.overflowY = 'auto';
	}

	return (
		<div>
			<button onClick={showDialog}>{openButton}</button>
			{visible && (
				<div className="overlay" onClick={preventDefault}>
					<div className="card dialog">
						<header className="dialog-header">
							<h3>{title}</h3>
							<button onClick={hideDialog} className="close-btn">
								<Icon path={mdiClose} size={1.2} />
							</button>
						</header>
						{children}
					</div>
				</div>
			)}
		</div>
	);
}
