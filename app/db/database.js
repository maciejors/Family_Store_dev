import { getDatabase, ref as databaseRef, child, get } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL, listAll } from 'firebase/storage';
import { app } from './firebase-setup';

const db = getDatabase(app);
const storage = getStorage(app);

/**
 * @typedef Brand
 * @property {string} id
 * @property {string} name
 *
 * @typedef AppPreview
 * @property {string} id
 * @property {string} name
 * @property {string} authorId
 * @property {string} version
 * @property {number} lastUpdated
 * @property {string} logoUrl
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
	const brandsRaw = {
		1: {
			id: '1',
			name: 'Grisso',
		},
		11: {
			id: '11',
			name: 'Grisso & lifi',
		},
	};
	return Object.values(brandsRaw);
}

/**
 * @param {string} brandId
 * @returns {Promise<Brand>}
 */
export async function getBrandById(brandId) {
	try {
		const snapshot = await get(child(databaseRef(db), `Family Store 2/Brands/${brandId}`));

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
		const snapshot = await get(child(databaseRef(db), 'Family Store 2/Apps'));

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
 * @param {string} appId
 * @returns {Promise<AppDetails>}
 */
export async function getAppDetails(appId) {
	try {
		const snapshot = await get(child(databaseRef(db), `Family Store 2/Apps/${appId}`));

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
		return [];
	}
}

/**
 * @param {string} appId
 * @returns {Promise<AppUpdateDetails>}
 */
export async function getAppUpdateDetails(appId) {
	try {
		const snapshot = await get(child(databaseRef(db), `Family Store 2/Apps/${appId}`));

		if (!snapshot.exists()) {
			throw new Error('Database No Data Error');
		}
		const version = snapshot.child('version').val();
		const changelog = snapshot.child('changelog').val();

		return { version, changelog };
	} catch (error) {
		console.error(error);
		return [];
	}
}

async function getLogoUrl(appId) {
	const logoRef = storageRef(storage, `Family Store 2/Apps/${appId}/logo.png`);
	const logoUrl = await getDownloadURL(logoRef);
	return logoUrl;
}

async function getAppDownloadUrl(appId) {
	const apkRef = storageRef(storage, `Family Store 2/Apps/${appId}/latest.apk`);
	const url = await getDownloadURL(apkRef);
	return url;
}

async function getPictureUrls(appId) {
	try {
		const picturesRef = storageRef(storage, `Family Store 2/Apps/${appId}/pictures`);
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
 * @param {string} appId
 * @param {string} filePath
 * @param {string} newVersion
 * @param {string} changelog
 */
export async function updateApp(appId, filePath, newVersion, changelog) {}
