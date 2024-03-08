'use client';

import React, { useEffect, useState } from 'react';

export default function LastUpdatedLabel({ lastUpdatedMillis, prefix }) {
	/**
	 * @param {number} millis
	 * @returns {string} Date formatted like this: 8 Jan 2023
	 */
	const [labelToDisplay, setLabelToDisplay] = useState('');
	useEffect(() => {
		const date = new Date(lastUpdatedMillis);
		const formattingOptions = { year: 'numeric', month: 'short', day: 'numeric' };
		const formattedDate = date.toLocaleDateString(navigator.language, formattingOptions);
		setLabelToDisplay(`${prefix !== undefined ? prefix : ''}${formattedDate}`);
	}, []);

	return <p>{labelToDisplay}</p>;
}
