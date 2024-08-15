'use server';

import { sendPushAppUpdate, sendPushNewApp } from '@/app/notifications/onesignal';

/**
 * Notify Family Store users on a new app being published
 *
 * @param {string} appId
 * @param {string} appName
 */
export async function notifyUsersOnNewApp(appId, appName) {
	await sendPushNewApp(appId, appName);
}

/**
 * Notify Family Store users on an update to some app being published
 *
 * @param {string} appId
 * @param {string} appName
 * @param {string} newVersion
 */
export async function notifyUsersOnAppUpdate(appId, appName, newVersion) {
	await sendPushAppUpdate(appId, appName, newVersion);
}
