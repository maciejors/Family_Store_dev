import Translator from '@/models/Translator';
import z from 'zod';
import { fileListToSingleFile, ZodFileExtras } from './util/files';

export const createUpdateAppSchema = (t: Translator) => {
	const zFile = new ZodFileExtras(t);

	return z.object({
		apkFile: z.preprocess(fileListToSingleFile, zFile.apk(t('apkRequired'))),
		newVersion: z.string().trim().min(1, t('newVersionRequired')),
		changelog: z.string().trim(),
	});
};

type UpdateAppData = z.infer<ReturnType<typeof createUpdateAppSchema>>;
export default UpdateAppData;
