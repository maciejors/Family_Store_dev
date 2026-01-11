'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { editApp, getAppDetails } from '@/lib/supabase/database/apps';
import AppFormTemplate from '../AppFormTemplate';
import EditAppData, { editAppSchema } from '@/schemas/EditAppData';
import FileInput from '@/components/inputs/FileInput';
import TextInput from '@/components/inputs/TextInput';
import TextArea from '@/components/inputs/TextArea';
import LogoEditor from './inputs/LogoEditor';
import PictureDeletePicker from './inputs/PictureDeletePicker';

export type EditAppFormProps = {
	appId: number;
};

export default function EditAppForm({ appId }: EditAppFormProps) {
	const {
		register: formRegister,
		unregister: formUnregister,
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(editAppSchema),
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
			name="Edit app form"
			isLoading={!initAppDetails}
			submitBtnText="Zapisz zmiany"
		>
			<TextInput
				{...formRegister('newName')}
				label="Nazwa aplikacji: *"
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
				label="Opis:"
				error={errors.newDescription?.message}
				rows={10}
				cols={70}
			/>
			<TextArea
				{...formRegister('newChangelog')}
				label="Lista zmian:"
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
				noFilesLabel="Dodaj nowe screenshoty"
				accept="image/png, image/gif, image/jpeg"
				multiple={true}
				error={errors.newPicturesFiles?.message}
			/>
		</AppFormTemplate>
	);
}
