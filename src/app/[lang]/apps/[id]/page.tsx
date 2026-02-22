import { getAppDetails } from '@/lib/supabase/database/apps';
import AppDetails from '@/models/AppDetails';
import { notFound } from 'next/navigation';
import AppView from './_components/AppView';

export type AppDetailsPageProps = {
	params: Promise<{ id: number }>;
};

export default async function AppDetailsPage(props: AppDetailsPageProps) {
	async function handleGetAppDetails(): Promise<AppDetails> {
		const params = await props.params;
		try {
			return getAppDetails(params.id);
		} catch (err: any) {
			notFound();
		}
	}

	const app = await handleGetAppDetails();
	return <AppView app={app} />;
}
