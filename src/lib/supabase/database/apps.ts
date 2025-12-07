import { getFileUrl, storageBucket, supabase } from '../supabaseSetup';
import AppDetails from '@/models/AppDetails';
import AppPreview from '@/models/AppPreview';
import AppsByBrand from '@/models/AppsByBrand';
import AppUpdateDetails from '@/models/AppUpdateDetails';

export async function getCurrentAppVersion(appId: number): Promise<string | null> {
	const { data: app, error } = await supabase
		.from('apps')
		.select('version')
		.eq('id', appId)
		.maybeSingle();

	if (error) throw error;

	if (app) {
		return app.version;
	}
	return null;
}

function getLogoStoragePath(appId: number): string {
	return `Apps/${appId}/logo.png`;
}

function getApkStoragePath(appId: number): string {
	return `Apps/${appId}/latest.apk`;
}

function getAppPicturesStoragePath(appId: number): string {
	return `Apps/${appId}/pictures`;
}

function getLogoUrl(appId: number): string {
	return getFileUrl(getLogoStoragePath(appId));
}

function getApkDownloadUrl(appId: number): string {
	return getFileUrl(getApkStoragePath(appId));
}

async function getAppPictures(appId: number): Promise<{
	pictureNames: string[];
	pictureUrls: string[];
}> {
	const picturesPath = getAppPicturesStoragePath(appId);
	const { data: picturesData, error } = await storageBucket.list(picturesPath);

	if (error) throw error;

	const pictureNames = picturesData!.map((p) => p.name);
	const pictureUrls = pictureNames.map((name) => getFileUrl(`${picturesPath}/${name}`));
	return {
		pictureNames,
		pictureUrls,
	};
}

export async function getAppsForBrand(brandId: number): Promise<AppPreview[]> {
	const { data: fetchedApps, error } = await supabase
		.from('apps')
		.select(
			`id, 
      name, 
      brands!inner (name), 
      version, 
      lastUpdated:last_updated`
		)
		.eq('brand_id', brandId);

	if (error) throw error;

	return fetchedApps.map((app) => {
		return {
			...app,
			brandName: app.brands.name,
			logoUrl: getLogoUrl(app.id),
		};
	});
}

/**
 * @returns Apps grouped by brands. Only includes brands which have at least one app
 */
export async function getUserAppsByBrands(userUid: string): Promise<AppsByBrand[]> {
	const { data: fetchedApps, error } = await supabase
		.from('apps')
		.select(
			`id, 
      name, 
      brands!inner (id, name), 
      version, 
      lastUpdated:last_updated`
		)
		.eq('brands.owner_id', userUid);

	if (error) throw error;

	const appsByBrand: AppsByBrand[] = [];

	fetchedApps.forEach((app) => {
		const appPreview: AppPreview = {
			...app,
			brandName: app.brands.name,
			logoUrl: getLogoUrl(app.id),
		};

		const recordForBrand = appsByBrand.filter(
			(group) => group.brandId === app.brands.id
		)[0];

		if (recordForBrand) {
			recordForBrand.apps.push(appPreview);
		} else {
			appsByBrand.push({
				brandId: app.brands.id,
				brandName: app.brands.name,
				apps: [appPreview],
			});
		}
	});
	return appsByBrand;
}

export async function getAppDetails(appId: number): Promise<AppDetails> {
	const { data: fetchedApp, error } = await supabase
		.from('apps')
		.select(
			`id, 
      name, 
      brands (name), 
      version, 
      lastUpdated:last_updated,
      description,
      changelog`
		)
		.eq('id', appId)
		.single();

	if (error) throw error;

	const appPicturesData = await getAppPictures(appId);
	return {
		...fetchedApp,
		brandName: fetchedApp.brands.name,
		logoUrl: getLogoUrl(appId),
		downloadUrl: getApkDownloadUrl(appId),
		...appPicturesData,
	};
}

export async function getAppUpdateDetails(appId: number): Promise<AppUpdateDetails> {
	const { data: fetchedAppUpdateDetails, error } = await supabase
		.from('apps')
		.select(
			`appName:name, 
      version, 
      changelog`
		)
		.eq('id', appId)
		.single();

	if (error) throw error;
	return fetchedAppUpdateDetails;
}

async function uploadAppPictures(appId: number, picturesFiles: File[]) {
	const picturesPath = getAppPicturesStoragePath(appId);
	for (const file of picturesFiles) {
		const { error } = await storageBucket.upload(`${picturesPath}/${file.name}`, file);
		// there is no error thrown here for now because we do not want to
		// interrupt app upload just because of failed picture upload.
		if (error) console.error(error);
	}
}

/**
 * @returns new app Id
 */
export async function addApp(
	name: string,
	brandId: number,
	apkFile: File,
	logoFile: File,
	version: string,
	description: string,
	appPicturesFiles: File[]
): Promise<number> {
	const { data: newAppMetadata, error: metadataInsertError } = await supabase
		.from('apps')
		.insert([
			{
				name,
				brand_id: brandId,
				version,
				description,
				last_updated: new Date().toISOString(),
			},
		])
		.select()
		.single();

	if (metadataInsertError) throw metadataInsertError;
	const appId = newAppMetadata.id;

	const { error: apkUploadError } = await storageBucket.upload(
		getApkStoragePath(appId),
		apkFile
	);
	if (apkUploadError) throw apkUploadError;

	const { error: logoUploadError } = await storageBucket.upload(
		getLogoStoragePath(appId),
		logoFile
	);
	if (logoUploadError) throw logoUploadError;

	await uploadAppPictures(appId, appPicturesFiles);

	return appId;
}

export async function updateApp(
	appId: number,
	apkFile: File,
	newVersion: string,
	changelog: string | null
) {
	const { error: apkUploadError } = await storageBucket.upload(
		getApkStoragePath(appId),
		apkFile,
		{ upsert: true }
	);

	if (apkUploadError) throw apkUploadError;

	const { error: metadataUpdateError } = await supabase
		.from('apps')
		.update({ version: newVersion, changelog, last_updated: new Date().toISOString() })
		.eq('id', appId);

	if (metadataUpdateError) throw metadataUpdateError;
}

export async function editApp(
	appId: number,
	newName: string,
	newDescription: string,
	newChangelog: string,
	newLogoFile: File | undefined,
	newPicturesFiles: File[],
	picturesToDeleteNames: string[]
) {
	if (newLogoFile) {
		const { error } = await storageBucket.upload(getLogoStoragePath(appId), newLogoFile, {
			upsert: true,
		});
		if (error) throw error;
	}

	const { error: metadataUpdateError } = await supabase
		.from('apps')
		.update({
			name: newName,
			description: newDescription,
			changelog: newChangelog,
		})
		.eq('id', appId);

	if (metadataUpdateError) throw metadataUpdateError;

	const picturesPath = getAppPicturesStoragePath(appId);
	if (picturesToDeleteNames.length > 0) {
		const { error: picturesDeleteError } = await storageBucket.remove(
			picturesToDeleteNames.map((filename) => `${picturesPath}/${filename}`)
		);
		if (picturesDeleteError) throw picturesDeleteError;
	}

	await uploadAppPictures(appId, newPicturesFiles);
}
