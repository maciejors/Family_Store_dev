import axios from 'axios';

const APP_ID = '89f2f3d2-146a-4d89-b1e3-c1c4abc405b3';
const API_KEY = process.env.ONESIGNAL_API_KEY;
const PUSH_ENDPOINT = 'https://api.onesignal.com/notifications';

interface NotificationRequestBody {
	headings: {
		en: string;
		pl: string;
	};
	contents: {
		en: string;
		pl: string;
	};
	included_segments: string[];
	target_channel: string;
	app_id: string;
	url?: string;
}

/**
 * Sends a push notification to all Family Store users
 */
async function sendPushToAll(
	englishTitle: string,
	polishTitle: string,
	englishContent: string,
	polishContent: string,
	url?: string
) {
	try {
		const requestBody: NotificationRequestBody = {
			headings: {
				en: englishTitle,
				pl: polishTitle,
			},
			contents: {
				en: englishContent,
				pl: polishContent,
			},
			included_segments: ['Subscribed Users'],
			target_channel: 'push',
			app_id: APP_ID,
		};
		if (url !== undefined) {
			requestBody.url = url;
		}
		const requestHeaders = {
			'Content-Type': 'application/json',
			Authorization: `Basic ${API_KEY}`,
		};

		if (process.env.NODE_ENV !== 'production') {
			console.log(`Notification triggered: ${requestBody}`);
			console.log('Note: notifications are only sent in production mode');
			return;
		}

		console.log('Sending push notification...');
		const response = await axios.post(PUSH_ENDPOINT, requestBody, {
			headers: requestHeaders,
		});
		console.log('Response data from OneSignal: ', response.data);
	} catch (error) {
		console.error(
			'Error sending notification:',
			error.response ? error.response.data : error.message
		);
	}
}

/**
 * Send a push notification to inform of a new application
 * being published to the Family Store.
 */
export async function sendPushNewApp(appId: number, appName: string) {
	await sendPushToAll(
		`NEW: ${appName}`,
		`NOWOŚĆ: ${appName}`,
		`Discover the latest at Family Store - ${appName}. Try it today!`,
		`Odkryj nowości w Family Store - ${appName}. Wypróbuj już dziś!`,
		`https://family-store.vercel.app/apps/${appId}`
	);
}

/**
 * Send a push notification to inform of an application receiving an update
 */
export async function sendPushAppUpdate(
	appId: number,
	appName: string,
	newVersion: string
) {
	await sendPushToAll(
		`Update: ${appName} (${newVersion})`,
		`Aktualizacja: ${appName} (${newVersion})`,
		`${appName} has just received an update. Check it out!`,
		`Aplikacja ${appName} właśnie otrzymała aktualizację. Sprawdź co nowego!`,
		`https://family-store.vercel.app/apps/${appId}`
	);
}
