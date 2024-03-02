import { getCurrentAppVersion } from '@/app/db/database';

export default async function handler(req, res) {
	const { appId } = req.query;
	try {
		const version = await getCurrentAppVersion(appId);
		if (version === '') {
			res.status(404).send({ error: 'App with the provided ID does not exist' });
			return;
		}
		res.status(200).send({ version });
	} catch (err) {
		res.status(500).send({ error: 'Failed to fetch data' });
	}
}
