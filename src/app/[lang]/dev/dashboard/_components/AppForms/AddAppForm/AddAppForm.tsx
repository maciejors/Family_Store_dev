'use client';

import FileInput from '@/components/inputs/FileInput';
import SelectBox from '@/components/inputs/SelectBox';
import TextArea from '@/components/inputs/TextArea';
import TextInput from '@/components/inputs/TextInput';
import { addApp } from '@/lib/supabase/database/apps';
import { getBrandsForUser } from '@/lib/supabase/database/brands';
import NewAppData, { createNewAppSchema } from '@/schemas/NewAppData';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { notifyUsersOnNewApp } from '../actions';
import AppFormTemplate from '../AppFormTemplate';

export type AddAppFormProps = {
	userUid: string;
};

export default function AddAppForm({ userUid }: AddAppFormProps) {
	const t = useTranslations('AppForms');
	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(createNewAppSchema(useTranslations('AppSchemas'))),
	});

	const { data: userBrands, isPending: isDataPending } = useQuery({
		queryKey: ['brands', userUid],
		queryFn: () => getBrandsForUser(userUid),
	});

	async function onSubmitValid(newAppData: NewAppData) {
		const appId = await addApp(newAppData);
		await notifyUsersOnNewApp(appId, newAppData.name);
	}

	return (
		<>
			{userBrands && userBrands.length === 0 ? (
				<div className="flex flex-col items-center text-base p-4">
					<p>{t('noBrandsTitle')}</p>
					<p>{t('noBrandsDescription')}</p>
				</div>
			) : (
				<AppFormTemplate
					onSubmit={handleSubmit(onSubmitValid)}
					name={t('addAppFormName')}
					isLoading={isDataPending}
					submitBtnText={t('addApp')}
				>
					<TextInput
						{...formRegister('name')}
						label={t('labelName')}
						error={errors.name?.message}
					/>
					<TextInput
						{...formRegister('version')}
						label={t('labelVersion')}
						placeholder={t('placeholderVersion')}
						error={errors.version?.message}
					/>
					<SelectBox
						{...formRegister('brandId')}
						label={t('labelBrandId')}
						options={userBrands ?? []}
						valueMapper={(brand) => brand.id.toString()}
						displayNameMapper={(brand) => brand.name}
						error={errors.brandId?.message}
					/>
					<FileInput
						{...formRegister('apkFile')}
						noFilesLabel={t('labelApkFile')}
						accept=".apk"
						multiple={false}
						error={errors.apkFile?.message}
					/>
					<FileInput
						{...formRegister('logoFile')}
						noFilesLabel={t('labelLogoFile')}
						accept=".png"
						multiple={false}
						error={errors.logoFile?.message}
					/>
					<TextArea
						{...formRegister('description')}
						label={t('labelDescription')}
						error={errors.description?.message}
						rows={10}
						cols={70}
					/>
					<FileInput
						{...formRegister('appPicturesFiles')}
						noFilesLabel={t('labelAppPicturesFiles')}
						accept="image/png, image/gif, image/jpeg"
						multiple={true}
						error={errors.appPicturesFiles?.message}
					/>
				</AppFormTemplate>
			)}
		</>
	);
}
