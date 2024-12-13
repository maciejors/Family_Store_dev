import { getDatabase, ref as databaseRef, child, get, update, set } from 'firebase/database';
import {
	getStorage,
	ref as storageRef,
	getDownloadURL,
	listAll,
	uploadBytes,
	deleteObject,
} from 'firebase/storage';
import { app } from './firebase-setup';
import Brand from '../models/Brand';
import AppPreview from '../models/AppPreview';
import AppDetails from '../models/AppDetails';
import AppUpdateDetails from '../models/AppUpdateDetails';
import AppsByBrand from '../models/AppsByBrand';

const db = getDatabase(app);
const storage = getStorage(app);

const DB_PATH = 'Family Store 2';
const APPS_PATH = `${DB_PATH}/Apps`;
const BRANDS_PATH = `${DB_PATH}/Brands`;
const USERS_PATH = `${DB_PATH}/Users`;

export async function getBrandsForUser(userId: string): Promise<Brand[]> {
	const snapshot = await get(child(databaseRef(db), `${USERS_PATH}/${userId}/brands`));

	if (!snapshot.exists()) {
		return [];
	}
	const brandsForUser = snapshot.val();

	const promises = Object.values(brandsForUser).map(async (brandId: string) => {
		const brandName: string = (
			await get(child(databaseRef(db), `${BRANDS_PATH}/${brandId}/name`))
		).val();

		return {
			id: brandId,
			name: brandName,
			ownerUserId: userId,
		};
	});

	return Promise.all(promises);
}

export async function getBrandById(brandId: string): Promise<Brand> {
	const snapshot = await get(child(databaseRef(db), `${BRANDS_PATH}/${brandId}`));

	if (!snapshot.exists()) {
		throw new Error('Database No Data Error');
	}

	return snapshot.val();
}

export async function getAppsForBrand(brandId: string): Promise<AppPreview[]> {
	const snapshot = await get(child(databaseRef(db), APPS_PATH));

	if (!snapshot.exists()) {
		throw new Error('Database No Data Error');
	}
	const apps: Partial<AppPreview>[] = snapshot
		.val()
		.filter((app: AppPreview) => app.authorId === brandId);
	apps.reverse();

	const promises = Object.values(apps).map(async (app) => {
		return {
			...app,
			logoUrl: await getLogoUrl(app.id),
		} as AppPreview;
	});

	return await Promise.all(promises);
}

export async function getUserAppsByBrands(userUid: string): Promise<AppsByBrand[]> {
	const snapshot = await get(child(databaseRef(db), APPS_PATH));

	if (!snapshot.exists()) {
		return [];
	}
	const userBrands = await getBrandsForUser(userUid);
	const result = [];
	for (let brand of userBrands) {
		const appsForBrand = await getAppsForBrand(brand.id);
		result.push({ brand, apps: appsForBrand });
	}
	return result;
}

export async function getAppDetails(appId: string): Promise<AppDetails> {
	const snapshot = await get(child(databaseRef(db), `${APPS_PATH}/${appId}`));

	if (!snapshot.exists()) {
		throw new Error('Database No Data Error');
	}
	const app: Partial<AppDetails> = snapshot.val();

	app.logoUrl = await getLogoUrl(appId);
	app.downloadUrl = await getAppDownloadUrl(appId);
	const appPictures = await getAppPictures(appId);
	app.pictureUrls = appPictures.pictureUrls;
	app.pictureNames = appPictures.pictureNames;

	return app as AppDetails;
}

export async function getAppUpdateDetails(appId: string): Promise<AppUpdateDetails> {
	const snapshot = await get(child(databaseRef(db), `${APPS_PATH}/${appId}`));

	if (!snapshot.exists()) {
		throw new Error('Database No Data Error');
	}
	const version = snapshot.child('version').val();
	const changelog = snapshot.child('changelog').val();
	const appName = snapshot.child('name').val();

	return { version, changelog, appName };
}

async function getLogoUrl(appId: string): Promise<string> {
	const logoRef = storageRef(storage, `${APPS_PATH}/${appId}/logo.png`);
	const logoUrl = await getDownloadURL(logoRef);
	return logoUrl;
}

async function getAppDownloadUrl(appId: string): Promise<string> {
	const apkRef = storageRef(storage, `${APPS_PATH}/${appId}/latest.apk`);
	const url = await getDownloadURL(apkRef);
	return url;
}

async function getAppPictures(appId: string): Promise<{
	pictureNames: string[];
	pictureUrls: string[];
}> {
	try {
		const picturesRef = storageRef(storage, `${APPS_PATH}/${appId}/pictures`);
		const fileList = await listAll(picturesRef);

		const promises = Object.values(fileList.items).map(async (picture) => {
			return await getDownloadURL(picture);
		});

		return {
			pictureNames: fileList.items.map((f) => f.name),
			pictureUrls: await Promise.all(promises),
		};
	} catch (error) {
		console.error(error);
		return { pictureNames: [], pictureUrls: [] };
	}
}

export async function updateBrand(brandId: string, newBrandName: string) {
	const brandRef = databaseRef(db, `${BRANDS_PATH}/${brandId}`);
	await update(brandRef, { name: newBrandName });
}

export async function addBrand(userId: string, newBrandName: string) {
	// prepare for new brand adding
	const brandId = Date.now().toString();
	const brandRef = databaseRef(db, `${BRANDS_PATH}/${brandId}`);
	// prepare for user data updating
	const userBrandsRef = databaseRef(db, `${USERS_PATH}/${userId}/brands`);
	const userBrandsIds = (await get(userBrandsRef)).val() ?? [];
	userBrandsIds.push(brandId);
	//
	await set(brandRef, { id: brandId, ownerUserId: userId, name: newBrandName });
	await set(userBrandsRef, userBrandsIds);
}

export async function deleteBrand(brandId: string) {
	// prepare for brand removal
	const brandRef = databaseRef(db, `${BRANDS_PATH}/${brandId}`);
	// prepare for user data updating
	const brand = await getBrandById(brandId);
	const userBrandsRef = databaseRef(db, `${USERS_PATH}/${brand.ownerUserId}/brands`);
	let userBrandsIds: string[] = (await get(userBrandsRef)).val();
	userBrandsIds = userBrandsIds.filter((b) => b !== brandId);
	// update
	await set(brandRef, null);
	await set(userBrandsRef, userBrandsIds);
}

export async function updateApp(
	appId: string,
	apkFile: File,
	newVersion: string,
	changelog: string
) {
	// 1. upload the new apk file
	const apkFileRef = storageRef(storage, `${APPS_PATH}/${appId}/latest.apk`);
	await uploadBytes(apkFileRef, apkFile);

	// 2. update app metadata
	const lastUpdated = Date.now();
	const appReference = databaseRef(db, `${APPS_PATH}/${appId}`);
	await update(appReference, { version: newVersion, changelog, lastUpdated });
}

async function uploadAppLogo(appId: string, logoFile: File) {
	const logoFileRef = storageRef(storage, `${APPS_PATH}/${appId}/logo.png`);
	await uploadBytes(logoFileRef, logoFile);
}

async function uploadAppPictures(appId: string, picturesFiles: File[]) {
	const picturesFolderRef = storageRef(storage, `${APPS_PATH}/${appId}/pictures`);
	for (let pictureFile of picturesFiles) {
		const pictureFileRef = storageRef(picturesFolderRef, pictureFile.name);
		await uploadBytes(pictureFileRef, pictureFile);
	}
}

export async function editApp(
	appId: string,
	newName: string,
	newDescription: string,
	newChangelog: string,
	newLogoFile: File | null = undefined,
	newPicturesFiles: File[] | null = undefined,
	picturesToDeleteNames: string[] | null = undefined
) {
	// 1. update app metadata
	const appReference = databaseRef(db, `${APPS_PATH}/${appId}`);
	await update(appReference, {
		name: newName,
		changelog: newChangelog,
		description: newDescription,
	});

	// 2. update app logo
	if (newLogoFile !== undefined) {
		await uploadAppLogo(appId, newLogoFile);
	}

	// 3. remove unwanted pictures
	if (picturesToDeleteNames !== undefined) {
		for (let pictureName of picturesToDeleteNames) {
			const pictureFileRef = storageRef(storage, `${APPS_PATH}/${appId}/pictures/${pictureName}`);
			await deleteObject(pictureFileRef);
		}
	}

	// 4. upload new pictures
	if (newPicturesFiles !== undefined) {
		await uploadAppPictures(appId, newPicturesFiles);
	}
}

export async function addApp(
	name: string,
	brandId: string,
	apkFile: File,
	logoFile: File,
	version: string,
	description: string,
	appPicturesFiles: File[]
): Promise<string> {
	// 1. select appropriate app id
	const allAppsSnapshot = await get(child(databaseRef(db), APPS_PATH));
	if (!allAppsSnapshot.exists()) {
		throw new Error('Database No Data Error');
	}
	const appCount = allAppsSnapshot.val().length.toString();
	const appId = appCount.toString();

	// 2. upload the apk file
	const apkFileRef = storageRef(storage, `${APPS_PATH}/${appId}/latest.apk`);
	await uploadBytes(apkFileRef, apkFile);

	// 3. upload the logo
	await uploadAppLogo(appId, logoFile);

	// 4. add app metadata
	const appReference = databaseRef(db, `${APPS_PATH}/${appId}`);
	const lastUpdated = Date.now();
	await set(appReference, {
		id: appId,
		name,
		authorId: brandId,
		version,
		description,
		lastUpdated,
	});

	// 5. upload app pictures
	await uploadAppPictures(appId, appPicturesFiles);
	return appId;
}

export async function getCurrentAppVersion(appId: string): Promise<string> {
	const appVersionRef = databaseRef(db, `${APPS_PATH}/${appId}/version`);
	const snapshot = await get(appVersionRef);

	if (!snapshot.exists()) {
		return '';
	}
	return snapshot.val();
}
