import z from 'zod';
import { fileListToSingleFile, uploadableApk } from './util/files';

export const updateAppSchema = z.object({
	apkFile: z.preprocess(
		fileListToSingleFile,
		uploadableApk('Plik instalacyjny jest wymagany')
	),
	newVersion: z.string().trim().min(1, 'ID nowej wersji jest wymagane'),
	changelog: z.string().trim(),
});

type UpdateAppData = z.infer<typeof updateAppSchema>;
export default UpdateAppData;
