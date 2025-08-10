import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentAppVersion } from '@/app/shared/supabase/database/getCurrentAppVersion';

type VersionResponse = {
	version?: string;
	error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<VersionResponse>) {
	const { appId } = req.query;

	if (typeof appId !== 'string') {
		res.status(400).send({ error: 'Invalid appId' });
		return;
	}

	try {
		const version = await getCurrentAppVersion(appId);
		if (version === null) {
			res.status(404).send({ error: 'App with the provided ID does not exist' });
			return;
		}
		res.status(200).send({ version });
	} catch (err) {
		res.status(500).send({ error: 'Failed to fetch data' });
	}
}
