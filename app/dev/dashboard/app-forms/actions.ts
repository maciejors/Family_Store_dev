'use server';

import { sendPushAppUpdate, sendPushNewApp } from '@/app/shared/notifications/onesignal';

export async function notifyUsersOnNewApp(appId: string, appName: string) {
	await sendPushNewApp(appId, appName);
}

export async function notifyUsersOnAppUpdate(appId: string, appName: string, newVersion: string) {
	await sendPushAppUpdate(appId, appName, newVersion);
}
