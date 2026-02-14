'use client';

import { mdiThemeLightDark } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import IconButton from './buttons/IconButton';

type ThemeOption = 'light' | 'dark';

function getDefaultTheme(): ThemeOption {
	const dataTheme = document.documentElement.getAttribute('data-theme');
	if (dataTheme) {
		return dataTheme as ThemeOption;
	} else {
		// if no data-theme then use the system default
		const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		return isSystemDark ? 'dark' : 'light';
	}
}

export default function ThemeToggle() {
	const defaultTheme = getDefaultTheme();
	const [theme, setTheme] = useState(defaultTheme);

	function toggleTheme() {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', newTheme);
		document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
		setTheme(newTheme);
	}

	return (
		<IconButton
			icon={<Icon path={mdiThemeLightDark} size={1} />}
			onClick={toggleTheme}
			aria-label="Toggle color scheme"
		/>
	);
}
