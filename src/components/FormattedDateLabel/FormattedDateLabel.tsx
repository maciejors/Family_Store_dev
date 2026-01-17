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
	const date = new Date(dateIso);
	const formattedDate = date.toLocaleDateString(navigator.language, formattingOptions);
	const labelToDisplay = `${prefix !== undefined ? prefix : ''}${formattedDate}`;
	return <p>{labelToDisplay}</p>;
}
