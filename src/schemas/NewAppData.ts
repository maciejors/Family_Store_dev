import Translator from '@/models/Translator';
import z from 'zod';
import { fileListToFileArray, fileListToSingleFile, ZodFileExtras } from './util/files';

export const createNewAppSchema = (t: Translator) => {
	const zFile = new ZodFileExtras(t);

	return z.object({
		name: z.string().trim().min(1, t('nameRequired')),
		brandId: z.coerce.number(t('brandRequired')),
		apkFile: z.preprocess(fileListToSingleFile, zFile.apk(t('apkRequired'))),
		logoFile: z.preprocess(fileListToSingleFile, zFile.image(t('logoRequired'))),
		version: z.string().trim().min(1, t('versionRequired')),
		description: z.string().trim(),
		appPicturesFiles: z.preprocess(fileListToFileArray, z.array(zFile.image())),
	});
};

type NewAppData = z.infer<ReturnType<typeof createNewAppSchema>>;
export default NewAppData;
