'use client';

import FileInput from '@/components/inputs/FileInput';
import TextArea from '@/components/inputs/TextArea';
import TextInput from '@/components/inputs/TextInput';
import { getAppUpdateDetails, updateApp } from '@/lib/supabase/database/apps';
import UpdateAppData, { createUpdateAppSchema } from '@/schemas/UpdateAppData';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { notifyUsersOnAppUpdate } from '../actions';
import AppFormTemplate from '../AppFormTemplate';

export type UpdateAppFormProps = {
	appId: number;
};

export default function UpdateAppForm({ appId }: UpdateAppFormProps) {
	const t = useTranslations('AppForms');
	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: zodResolver(createUpdateAppSchema(useTranslations('AppSchemas'))),
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
			name={t('updateAppFormName')}
			isLoading={isDataPending}
			submitBtnText={t('publishUpdate')}
		>
			<FileInput
				{...formRegister('apkFile')}
				noFilesLabel={t('labelApkFile')}
				accept=".apk"
				multiple={false}
				error={errors.apkFile?.message}
			/>
			<TextInput
				{...formRegister('newVersion')}
				label={t('labelVersion')}
				placeholder={t('placeholderNewVersion', {
					currVersion: currentAppData?.version ?? '',
				})}
				error={errors.newVersion?.message}
			/>
			<TextArea
				{...formRegister('changelog')}
				label={t('labelChangelog')}
				error={errors.changelog?.message}
				rows={10}
				cols={70}
			/>
		</AppFormTemplate>
	);
}
