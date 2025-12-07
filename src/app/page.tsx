import { redirect } from 'next/navigation';

export default function Home() {
	// in the future we might add app list here or something
	redirect('/dev/auth');
}
