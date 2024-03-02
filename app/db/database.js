import { getDatabase, ref as databaseRef, child, get, update, set } from 'firebase/database';
import {
	getStorage,
	ref as storageRef,
	getDownloadURL,
	listAll,
	uploadBytes,
} from 'firebase/storage';
import { app } from './firebase-setup';

const db = getDatabase(app);
const storage = getStorage(app);

const DB_PATH = 'Family Store 2';
const APPS_PATH = `${DB_PATH}/Apps`;
const BRANDS_PATH = `${DB_PATH}/Brands`;
const USERS_PATH = `${DB_PATH}/Users`;

/**
 * @typedef Brand
 * @property {string} id
 * @property {string} ownerUserId
 * @property {string} name
 *
 * @typedef AppPreview
 * @property {string} id
 * @property {string} name
 * @property {string} authorId
 * @property {string} version
 * @property {number} lastUpdated
 * @property {string} logoUrl
 * @property {string} description
 * @property {string} changelog
 *
 * @typedef AppDetails
 * @property {string} id
 * @property {string} name
 * @property {string} authorId
 * @property {string} version
 * @property {number} lastUpdated
 * @property {string} logoUrl
 * @property {string} description
 * @property {string} changelog
 * @property {string} downloadUrl
 * @property {string[]} pictureUrls
 *
 * @typedef AppUpdateDetails
 * @property {string} version
 * @property {string} changelog
 */

/**
 * @param {string} userId
 * @returns {Promise<Brand[]>}
 */
export async function getBrandsForUser(userId) {
	try {
		const snapshot = await get(child(databaseRef(db), `${USERS_PATH}/${userId}/brands`));

		if (!snapshot.exists()) {
			return [];
		}
		const brandsForUser = snapshot.val();

		const promises = Object.values(brandsForUser).map(async (brandId) => {
			const brandName = (await get(child(databaseRef(db), `${BRANDS_PATH}/${brandId}/name`))).val();

			return {
				id: brandId,
				name: brandName,
			};
		});

		return Promise.all(promises);
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * @param {string} brandId
 * @returns {Promise<Brand>}
 */
export async function getBrandById(brandId) {
	try {
		const snapshot = await get(child(databaseRef(db), `${BRANDS_PATH}/${brandId}`));

		if (!snapshot.exists()) {
			throw new Error('Database No Data Error');
		}

		return snapshot.val();
	} catch (error) {
		console.error(error);
		return {};
	}
}

/**
 * @param {string} brandId
 * @returns {Promise<AppPreview[]>}
 */
export async function getAppsForBrand(brandId) {
	try {
		const snapshot = await get(child(databaseRef(db), APPS_PATH));

		if (!snapshot.exists()) {
			throw new Error('Database No Data Error');
		}
		const apps = snapshot.val().filter((app) => app.authorId === brandId);
		apps.reverse();

		const promises = Object.values(apps).map(async (app) => {
			return {
				...app,
				logoUrl: await getLogoUrl(app.id),
			};
		});

		return await Promise.all(promises);
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * @typedef AppsByBrand
 * @property {Brand} brand
 * @property {AppPreview[]} apps
 *
 * @param {string} userUid
 * @returns {Promise<AppsByBrand[]>}
 */
export async function getUserAppsByBrands(userUid) {
	try {
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
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * @param {string} appId
 * @returns {Promise<AppDetails>}
 */
export async function getAppDetails(appId) {
	try {
		const snapshot = await get(child(databaseRef(db), `${APPS_PATH}/${appId}`));

		if (!snapshot.exists()) {
			throw new Error('Database No Data Error');
		}
		const app = snapshot.val();

		app.logoUrl = await getLogoUrl(appId);
		app.downloadUrl = await getAppDownloadUrl(appId);
		app.pictureUrls = await getPictureUrls(appId);

		return app;
	} catch (error) {
		console.error(error);
		return {};
	}
}

/**
 * @param {string} appId
 * @returns {Promise<AppUpdateDetails>}
 */
export async function getAppUpdateDetails(appId) {
	try {
		const snapshot = await get(child(databaseRef(db), `${APPS_PATH}/${appId}`));

		if (!snapshot.exists()) {
			throw new Error('Database No Data Error');
		}
		const version = snapshot.child('version').val();
		const changelog = snapshot.child('changelog').val();

		return { version, changelog };
	} catch (error) {
		console.error(error);
		return {};
	}
}

async function getLogoUrl(appId) {
	const logoRef = storageRef(storage, `${APPS_PATH}/${appId}/logo.png`);
	const logoUrl = await getDownloadURL(logoRef);
	return logoUrl;
}

async function getAppDownloadUrl(appId) {
	const apkRef = storageRef(storage, `${APPS_PATH}/${appId}/latest.apk`);
	const url = await getDownloadURL(apkRef);
	return url;
}

async function getPictureUrls(appId) {
	try {
		const picturesRef = storageRef(storage, `${APPS_PATH}/${appId}/pictures`);
		const fileList = await listAll(picturesRef);

		const promises = Object.values(fileList.items).map(async (picture) => {
			return await getDownloadURL(picture);
		});

		return await Promise.all(promises);
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * @param {string} brandId
 * @param {string} newBrandName
 */
export async function updateBrand(brandId, newBrandName) {
	const brandRef = databaseRef(db, `${BRANDS_PATH}/${brandId}`);
	await update(brandRef, { name: newBrandName });
}

/**
 * @param {string} userId
 * @param {string} newBrandName
 */
export async function addBrand(userId, newBrandName) {
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

/**
 * @param {string} brandId
 */
export async function deleteBrand(brandId) {
	// prepare for brand removal
	const brandRef = databaseRef(db, `${BRANDS_PATH}/${brandId}`);
	// prepare for user data updating
	const brand = await getBrandById(brandId);
	const userBrandsRef = databaseRef(db, `${USERS_PATH}/${brand.ownerUserId}/brands`);
	let userBrandsIds = (await get(userBrandsRef)).val();
	userBrandsIds = userBrandsIds.filter((b) => b !== brandId);
	//
	await set(brandRef, null);
	await set(userBrandsRef, userBrandsIds);
}

/**
 * @param {string} appId
 * @param {File} apkFile
 * @param {string} newVersion
 * @param {string} changelog
 */
export async function updateApp(appId, apkFile, newVersion, changelog) {
	// 1. upload the new apk file
	const apkFileRef = storageRef(storage, `${APPS_PATH}/${appId}/latest.apk`);
	await uploadBytes(apkFileRef, apkFile);

	// 2. update app metadata
	const appReference = databaseRef(db, `${APPS_PATH}/${appId}`);
	await update(appReference, { version: newVersion, changelog });
}
