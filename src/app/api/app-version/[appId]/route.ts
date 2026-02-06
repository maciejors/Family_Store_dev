import { getCurrentAppVersion } from '@/lib/supabase/database/apps';
import { NextRequest, NextResponse } from 'next/server';

type SuccessfulResponse = {
	version: string;
	url: string;
};

type ErrorResponse = {
	error: string;
};

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ appId: string }> }
) {
	const { appId: appIdString } = await params;
	const appId = parseInt(appIdString);

	if (isNaN(appId)) {
		return NextResponse.json<ErrorResponse>({ error: 'Invalid appId' }, { status: 400 });
	}

	try {
		const version = await getCurrentAppVersion(appId);

		if (version === null) {
			return NextResponse.json<ErrorResponse>(
				{ error: 'App with the provided ID does not exist' },
				{ status: 404 }
			);
		}
		return NextResponse.json<SuccessfulResponse>(
			{ version, url: `https://family-store.vercel.app/apps/${appId}` },
			{ status: 200 }
		);
	} catch (err) {
		console.log(err);

		return NextResponse.json<ErrorResponse>(
			{ error: 'Failed to fetch data' },
			{ status: 500 }
		);
	}
}
