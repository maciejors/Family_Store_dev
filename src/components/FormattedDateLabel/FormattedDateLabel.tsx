'use client';

import React, { useEffect, useState } from 'react';

const formattingOptions: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
};

export type FormattedDateLabelProps = {
	dateIso: string;
	prefix: string;
};

export default function FormattedDateLabel({ dateIso, prefix }: FormattedDateLabelProps) {
	const [labelToDisplay, setLabelToDisplay] = useState('');
	useEffect(() => {
		const date = new Date(dateIso);
		const formattedDate = date.toLocaleDateString(navigator.language, formattingOptions);
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setLabelToDisplay(`${prefix !== undefined ? prefix : ''}${formattedDate}`);
	}, [dateIso, prefix]);

	return <p>{labelToDisplay}</p>;
}
