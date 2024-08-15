'use server';

import { sendPushNewApp } from '@/app/notifications/onesignal';

/**
 * Notify Family Store users on a new app being published
 *
 * @param {string} appId
 * @param {string} appName
 */
export async function notifyUsersOnNewApp(appId, appName) {
	await sendPushNewApp(appId, appName);
}
