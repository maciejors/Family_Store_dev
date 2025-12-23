export default interface NewAppData {
	name: string;
	brandId: number;
	apkFile: File;
	logoFile: File;
	version: string;
	description: string;
	appPicturesFiles: File[];
}
