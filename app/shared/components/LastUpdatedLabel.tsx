'use client';

import React, { useEffect, useState } from 'react';

const formattingOptions: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
};

export default function LastUpdatedLabel({ lastUpdatedMillis, prefix }) {
	/**
	 * @param {number} millis
	 * @returns {string} Date formatted like this: 8 Jan 2023
	 */
	const [labelToDisplay, setLabelToDisplay] = useState('');
	useEffect(() => {
		const date = new Date(lastUpdatedMillis);
		const formattedDate = date.toLocaleDateString(navigator.language, formattingOptions);
		setLabelToDisplay(`${prefix !== undefined ? prefix : ''}${formattedDate}`);
	}, []);

	return <p>{labelToDisplay}</p>;
}
