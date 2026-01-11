import z, { ZodFile } from 'zod';

export function fileListToFileArray(obj: unknown): unknown {
	if (obj instanceof FileList) {
		return Array.from(obj);
	}
	return obj;
}

export function fileListToSingleFile(obj: unknown): unknown {
	if (obj instanceof FileList) {
		const fileArray = fileListToFileArray(obj) as File[];
		return fileArray[0];
	}
	return obj;
}

export function uploadableApk(message?: string): ZodFile {
	return constraintFileSize(
		z
			.file(message)
			.mime(
				['application/vnd.android.package-archive', 'application/octet-stream'],
				'Plik instalacyjny musi być plikiem .apk'
			)
	);
}

export function uploadableImage(message?: string): ZodFile {
	return constraintFileSize(
		z
			.file(message)
			.mime(['image/jpeg', 'image/png'], 'Zdjęcie musi być w formacie .png lub .jpg')
	);
}

function constraintFileSize(zodFile: ZodFile): ZodFile {
	return zodFile.max(50_000_000, 'Plik jest zbyt duży');
}
