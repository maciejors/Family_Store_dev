/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET } from './route';
import * as appsApi from '@/lib/supabase/database/apps';

jest.mock('@/lib/supabase/database/apps');

const mockAppsApi = appsApi as jest.Mocked<typeof appsApi>;

async function makeRequest(appId: string) {
	const req = new NextRequest(`http://localhost/api/app-version`);
	return await GET(req, { params: Promise.resolve({ appId }) });
}

test('Should return a version for an existing app', async () => {
	const expectedVersion = '1.6.3';
	mockAppsApi.getCurrentAppVersion.mockResolvedValueOnce(expectedVersion);

	const response = await makeRequest('1');
	expect(response.status).toBe(200);
	const body = await response.json();
	expect(body.version).toBe(expectedVersion);
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
