import z from 'zod';
import { fileListToFileArray, fileListToSingleFile, uploadableImage } from './util/files';

export const editAppSchema = z.object({
	newName: z.string().trim().min(1, 'Nazwa aplikacji jest wymagana'),
	newLogoFile: z.preprocess(
		fileListToSingleFile,
		uploadableImage('Logo aplikacji jest wymagane').optional()
	),
	newDescription: z.string().trim(),
	newChangelog: z.string().trim(),
	newPicturesFiles: z.preprocess(fileListToFileArray, z.array(uploadableImage())),
	picturesToDeleteNames: z.array(z.string()).default([]),
});

type EditAppData = z.infer<typeof editAppSchema>;
export default EditAppData;
