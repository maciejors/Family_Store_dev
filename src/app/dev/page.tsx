import { redirect } from 'next/navigation';

export default function DevHome() {
	// in the future we might add some home page for devs
	redirect('/dev/auth');
}
