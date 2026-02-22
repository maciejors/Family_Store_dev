'use client';

import FileInput from '@/components/inputs/FileInput';
import TextArea from '@/components/inputs/TextArea';
import TextInput from '@/components/inputs/TextInput';
import { editApp, getAppDetails } from '@/lib/supabase/database/apps';
import EditAppData, { createEditAppSchema } from '@/schemas/EditAppData';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AppFormTemplate from '../AppFormTemplate';
import LogoEditor from './inputs/LogoEditor';
import PictureDeletePicker from './inputs/PictureDeletePicker';

export type EditAppFormProps = {
	appId: number;
};

export default function EditAppForm({ appId }: EditAppFormProps) {
	const t = useTranslations('AppForms');
	const {
		register: formRegister,
		unregister: formUnregister,
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(createEditAppSchema(useTranslations('AppSchemas'))),
	});

	const { data: initAppDetails } = useQuery({
		queryKey: ['app', appId],
		queryFn: () => getAppDetails(appId),
	});

	useEffect(() => {
		if (initAppDetails) {
			reset({
				newName: initAppDetails.name,
				newChangelog: initAppDetails.changelog ?? '',
				newDescription: initAppDetails.description ?? '',
			});
		}
	}, [initAppDetails, reset]);

	async function onSubmitValid(editAppData: EditAppData) {
		await editApp(appId, editAppData);
	}

	return (
		<AppFormTemplate
			onSubmit={handleSubmit(onSubmitValid)}
			name={t('editAppFormName')}
			isLoading={!initAppDetails}
			submitBtnText={t('saveChanges')}
		>
			<TextInput
				{...formRegister('newName')}
				label={t('labelName')}
				error={errors.newName?.message}
			/>
			<LogoEditor
				{...formRegister('newLogoFile')}
				logoUnsetter={() => formUnregister('newLogoFile')}
				currentLogoUrl={initAppDetails?.logoUrl ?? ''}
				error={errors.newLogoFile?.message}
			/>
			<TextArea
				{...formRegister('newDescription')}
				label={t('labelDescription')}
				error={errors.newDescription?.message}
				rows={10}
				cols={70}
			/>
			<TextArea
				{...formRegister('newChangelog')}
				label={t('labelChangelog')}
				error={errors.newChangelog?.message}
				rows={10}
				cols={70}
			/>
			<Controller
				control={control}
				name="picturesToDeleteNames"
				render={({ field }) => (
					<PictureDeletePicker
						allPictures={initAppDetails?.pictures ?? []}
						picturesToDeleteNames={field.value ?? []}
						onPicturesToDeleteNamesChange={field.onChange}
						error={errors.picturesToDeleteNames?.message}
					/>
				)}
			/>
			<FileInput
				{...formRegister('newPicturesFiles')}
				noFilesLabel={t('labelNewPicturesFiles')}
				accept="image/png, image/gif, image/jpeg"
				multiple={true}
				error={errors.newPicturesFiles?.message}
			/>
		</AppFormTemplate>
	);
}
