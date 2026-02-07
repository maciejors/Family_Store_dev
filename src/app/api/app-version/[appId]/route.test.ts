/**
 * @jest-environment node
 */
import * as appsApi from '@/lib/supabase/database/apps';
import { NextRequest } from 'next/server';
import { GET } from './route';

const mockAppsApi = appsApi as jest.Mocked<typeof appsApi>;

async function makeRequest(appId: string) {
	const req = new NextRequest(`http://localhost/api/app-version`);
	return await GET(req, { params: Promise.resolve({ appId }) });
}

test('Should return the version and URL for an existing app', async () => {
	const appId = '1';
	const expectedUrl = `https://family-store.vercel.app/apps/${appId}`;
	const expectedVersion = '1.6.3';
	mockAppsApi.getCurrentAppVersion.mockResolvedValueOnce(expectedVersion);

	const response = await makeRequest(appId);
	expect(response.status).toBe(200);
	const body = await response.json();
	expect(body).toEqual({
		version: expectedVersion,
		url: expectedUrl,
	});
});

test('Should return 404 when there is no app with the specified appId', async () => {
	mockAppsApi.getCurrentAppVersion.mockResolvedValueOnce(null);

	const response = await makeRequest('1');
	expect(response.status).toBe(404);
	const body = await response.json();
	expect(body.error).toBe('App with the provided ID does not exist');
});

test('Should return 400 for an invalid appId', async () => {
	const response = await makeRequest('xd');
	expect(response.status).toBe(400);
	const body = await response.json();
	expect(body.error).toBe('Invalid appId');
});
