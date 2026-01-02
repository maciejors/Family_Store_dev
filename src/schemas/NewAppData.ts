import z from 'zod';
import {
	fileListToFileArray,
	fileListToSingleFile,
	uploadableApk,
	uploadableImage,
} from './util/files';

export const newAppSchema = z.object({
	name: z.string().trim().min(1, 'Nazwa aplikacji jest wymagana'),
	brandId: z.coerce.number('Marka jest wymagana'),
	apkFile: z.preprocess(
		fileListToSingleFile,
		uploadableApk('Plik instalacyjny jest wymagany')
	),
	logoFile: z.preprocess(
		fileListToSingleFile,
		uploadableImage('Logo aplikacji jest wymagane')
	),
	version: z.string().trim().min(1, 'ID wersji aplikacji jest wymagane'),
	description: z.string().trim(),
	appPicturesFiles: z.preprocess(fileListToFileArray, z.array(uploadableImage())),
});

type NewAppData = z.infer<typeof newAppSchema>;
export default NewAppData;
