export function getFakeFile(fileName: string, type: string): File {
	return new File(['fake contents'], fileName, {
		type: type,
	});
}

export function getFakePicture(fileName: string): File {
	return getFakeFile(fileName, 'image/png');
}

export function getFakeApk(fileName: string): File {
	return getFakeFile(fileName, 'application/vnd.android.package-archive');
}
