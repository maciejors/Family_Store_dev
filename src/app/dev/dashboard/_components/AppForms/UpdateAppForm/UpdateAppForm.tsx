'use client';

import React, { useEffect } from 'react';
import { getAppUpdateDetails, updateApp } from '@/lib/supabase/database/apps';
import { notifyUsersOnAppUpdate } from '../actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import UpdateAppData, { updateAppSchema } from '@/schemas/UpdateAppData';
import FileInput from '@/components/inputs/FileInput';
import TextInput from '@/components/inputs/TextInput';
import TextArea from '@/components/inputs/TextArea';
import AppFormTemplate from '../AppFormTemplate';

export type UpdateAppFormProps = {
	appId: number;
};

export default function UpdateAppForm({ appId }: UpdateAppFormProps) {
	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: zodResolver(updateAppSchema),
	});

	const { data: currentAppData, isPending: isDataPending } = useQuery({
		queryKey: ['app', appId],
		queryFn: () => getAppUpdateDetails(appId),
	});

	useEffect(() => {
		if (currentAppData) {
			setValue('changelog', currentAppData.changelog ?? '');
		}
	}, [currentAppData, setValue]);

	async function onSubmitValid(updateAppData: UpdateAppData) {
		await updateApp(appId, updateAppData);
		await notifyUsersOnAppUpdate(
			appId,
			currentAppData!.appName,
			updateAppData.newVersion
		);
	}

	return (
		<AppFormTemplate
			onSubmit={handleSubmit(onSubmitValid)}
			name="Update app form"
			isLoading={isDataPending}
			submitBtnText="Wydaj aktualizację"
		>
			<FileInput
				{...formRegister('apkFile')}
				noFilesLabel="Dodaj plik instalacyjny *"
				accept=".apk"
				multiple={false}
				error={errors.apkFile?.message}
			/>
			<TextInput
				{...formRegister('newVersion')}
				label="Wersja: *"
				placeholder={`Obecna wersja: ${currentAppData?.version}`}
				error={errors.newVersion?.message}
			/>
			<TextArea
				{...formRegister('changelog')}
				label="Lista zmian:"
				error={errors.changelog?.message}
				rows={10}
				cols={70}
			/>
		</AppFormTemplate>
	);
}
