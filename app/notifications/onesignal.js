import axios from 'axios';

const APP_ID = '89f2f3d2-146a-4d89-b1e3-c1c4abc405b3';
const API_KEY = process.env.ONESIGNAL_API_KEY;
const PUSH_ENDPOINT = 'https://api.onesignal.com/notifications';

/**
 * Sends a push notification to all Family Store users
 *
 * @param {string} englishTitle notification title (heading) for the English locale
 * @param {string} polishTitle notification title (heading) for the Polish locale
 * @param {string} englishContent notification content for the English locale
 * @param {string} polishContent notification content for the Polish locale
 * @param {string?} url URL to launch when a user clicks on the notification
 */
async function sendPushToAll(
	englishTitle,
	polishTitle,
	englishContent,
	polishContent,
	url = undefined
) {
	try {
		const requestBody = {
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
		await axios.post(PUSH_ENDPOINT, requestBody, { headers: requestHeaders });
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
 *
 * @param {number} appId
 * @param {string} appName
 */
export async function sendPushNewApp(appId, appName) {
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
 *
 * @param {number} appId
 * @param {string} appName
 */
export async function sendPushAppUpdate(appId, appName, newVersion) {
	await sendPushToAll(
		`Update: ${appName} (${newVersion})`,
		`Aktualizacja: ${appName} (${newVersion})`,
		`${appName} has just received an update. Check it out!`,
		`Aplikacja ${appName} właśnie otrzymała aktualizację. Sprawdź co nowego!`,
		`https://family-store.vercel.app/apps/${appId}`
	);
}
