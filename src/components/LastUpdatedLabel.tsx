'use client';

import React, { useEffect, useState } from 'react';

const formattingOptions: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
};

export type LastUpdatedLabelProps = {
	lastUpdatedIso: string;
	prefix: string;
};

export default function LastUpdatedLabel({
	lastUpdatedIso,
	prefix,
}: LastUpdatedLabelProps) {
	const [labelToDisplay, setLabelToDisplay] = useState('');
	useEffect(() => {
		const date = new Date(lastUpdatedIso);
		const formattedDate = date.toLocaleDateString(navigator.language, formattingOptions);
		setLabelToDisplay(`${prefix !== undefined ? prefix : ''}${formattedDate}`);
	}, [lastUpdatedIso, prefix]);

	return <p>{labelToDisplay}</p>;
}
