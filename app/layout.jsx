import './globals.css';
import { Rubik } from 'next/font/google';

const font = Rubik({ subsets: ['latin-ext'], weight: '400' });

export const metadata = {
	title: 'Family Store Dev',
	description: 'Family Store for App Developers',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={font.className}>
				{children}
			</body>
		</html>
	);
}
