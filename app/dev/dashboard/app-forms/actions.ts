'use server';

import { sendPushAppUpdate, sendPushNewApp } from '@/app/shared/notifications/onesignal';

export async function notifyUsersOnNewApp(appId: number, appName: string) {
	await sendPushNewApp(appId, appName);
}

export async function notifyUsersOnAppUpdate(
	appId: number,
	appName: string,
	newVersion: string
) {
	await sendPushAppUpdate(appId, appName, newVersion);
}
