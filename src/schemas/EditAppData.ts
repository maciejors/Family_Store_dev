import Translator from '@/models/Translator';
import z from 'zod';
import { fileListToFileArray, fileListToSingleFile, ZodFileExtras } from './util/files';

export const createEditAppSchema = (t: Translator) => {
	const zFile = new ZodFileExtras(t);

	return z.object({
		newName: z.string().trim().min(1, t('nameRequired')),
		newLogoFile: z.preprocess(
			fileListToSingleFile,
			zFile.image(t('logoRequired')).optional()
		),
		newDescription: z.string().trim(),
		newChangelog: z.string().trim(),
		newPicturesFiles: z.preprocess(fileListToFileArray, z.array(zFile.image())),
		picturesToDeleteNames: z.array(z.string()).default([]),
	});
};

type EditAppData = z.infer<ReturnType<typeof createEditAppSchema>>;
export default EditAppData;
