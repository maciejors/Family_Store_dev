import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAppVersion } from '@/app/shared/supabase/database/apps';

type VersionResponse = {
	version?: string;
	error?: string;
};

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ appId: string }> }
) {
	const { appId: appIdString } = await params;
	const appId = parseInt(appIdString);

	if (isNaN(appId)) {
		return NextResponse.json<VersionResponse>(
			{ error: 'Invalid appId' },
			{ status: 400 }
		);
	}

	try {
		const version = await getCurrentAppVersion(appId);

		if (version === null) {
			return NextResponse.json<VersionResponse>(
				{ error: 'App with the provided ID does not exist' },
				{ status: 404 }
			);
		}
		return NextResponse.json<VersionResponse>({ version }, { status: 200 });
	} catch (err) {
		console.log(err);

		return NextResponse.json<VersionResponse>(
			{ error: 'Failed to fetch data' },
			{ status: 500 }
		);
	}
}
