export default interface UpdateAppData {
	apkFile: File;
	newVersion: string;
	changelog: string | null;
}
