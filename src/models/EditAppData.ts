export default interface EditAppData {
	newName: string;
	newDescription: string;
	newChangelog: string;
	newLogoFile: File | undefined;
	newPicturesFiles: File[];
	picturesToDeleteNames: string[];
}
