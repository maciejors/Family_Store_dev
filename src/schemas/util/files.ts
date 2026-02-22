import Translator from '@/models/Translator';
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

export class ZodFileExtras {
	t: Translator;

	constructor(t: Translator) {
		this.t = t;
	}

	apk(messageNotProvided?: string): ZodFile {
		return this.constraintFileSize(
			z
				.file(messageNotProvided)
				.mime(
					['application/vnd.android.package-archive', 'application/octet-stream'],
					this.t('apkWrongMime')
				)
		);
	}

	image(messageNotProvided?: string): ZodFile {
		return this.constraintFileSize(
			z
				.file(messageNotProvided)
				.mime(['image/jpeg', 'image/png'], this.t('imageWrongMime'))
		);
	}

	private constraintFileSize(zodFile: ZodFile): ZodFile {
		return zodFile.max(50_000_000, this.t('fileTooLarge'));
	}
}
