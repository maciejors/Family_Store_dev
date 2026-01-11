'use client';

import React, { useEffect, useState } from 'react';
import { getAppUpdateDetails, updateApp } from '@/lib/supabase/database/apps';
import { notifyUsersOnAppUpdate } from '../actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import UpdateAppData, { updateAppSchema } from '@/schemas/UpdateAppData';
import FileInput from '@/components/inputs/FileInput';
import TextInput from '@/components/inputs/TextInput';
import TextArea from '@/components/inputs/TextArea';
import AppFormTemplate from '../AppFormTemplate';

export type UpdateAppFormProps = {
	appId: number;
};

export default function UpdateAppForm({ appId }: UpdateAppFormProps) {
	const [isDataFetching, setisDataFetching] = useState(true);
	const [appName, setAppName] = useState('');
	const [currentVersion, setCurrentVersion] = useState('');

	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: zodResolver(updateAppSchema),
	});

	useEffect(() => {
		getAppUpdateDetails(appId).then((currentAppData) => {
			setValue('changelog', currentAppData.changelog ?? '');
			setCurrentVersion(currentAppData.version);
			setAppName(currentAppData.appName);
			setisDataFetching(false);
		});
	}, [appId, setValue]);

	async function onSubmitValid(updateAppData: UpdateAppData) {
		await updateApp(appId, updateAppData);
		await notifyUsersOnAppUpdate(appId, appName, updateAppData.newVersion);
	}

	return (
		<AppFormTemplate
			onSubmit={handleSubmit(onSubmitValid)}
			name="Update app form"
			isLoading={isDataFetching}
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
				placeholder={`Obecna wersja: ${currentVersion}`}
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
