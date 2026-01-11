'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addApp } from '@/lib/supabase/database/apps';
import { getBrandsForUser } from '@/lib/supabase/database/brands';
import { notifyUsersOnNewApp } from '../actions';
import Brand from '@/models/Brand';
import NewAppData, { newAppSchema } from '@/schemas/NewAppData';
import FileInput from '@/components/inputs/FileInput';
import TextInput from '@/components/inputs/TextInput';
import TextArea from '@/components/inputs/TextArea';
import SelectBox from '@/components/inputs/SelectBox';
import AppFormTemplate from '../AppFormTemplate';

export type AddAppFormProps = {
	userUid: string;
};

export default function AddAppForm({ userUid }: AddAppFormProps) {
	const [isDataFetching, setisDataFetching] = useState(true);
	const [userBrands, setUserBrands] = useState<Brand[]>([]);

	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: zodResolver(newAppSchema),
	});

	useEffect(() => {
		getBrandsForUser(userUid).then((brands) => {
			setUserBrands(brands);
			if (brands.length > 0) {
				setValue('brandId', brands[0].id);
			}
			setisDataFetching(false);
		});
	}, [userUid, setValue]);

	async function onSubmitValid(newAppData: NewAppData) {
		const appId = await addApp(newAppData);
		await notifyUsersOnNewApp(appId, newAppData.name);
	}

	return (
		<>
			{!isDataFetching && userBrands.length === 0 ? (
				<div className="flex flex-col items-center text-base p-4">
					<p>Brak marek powiązanych z tym kontem.</p>
					<p>Aby dodać aplikację, należy posiadać przynajmniej jedną markę.</p>
				</div>
			) : (
				<AppFormTemplate
					onSubmit={handleSubmit(onSubmitValid)}
					name="Add app form"
					isLoading={isDataFetching}
					submitBtnText="Dodaj aplikację"
				>
					<TextInput
						{...formRegister('name')}
						label="Nazwa aplikacji: *"
						error={errors.name?.message}
					/>
					<TextInput
						{...formRegister('version')}
						label="Wersja: *"
						placeholder="np. 1.0.0"
						error={errors.version?.message}
					/>
					<SelectBox
						{...formRegister('brandId')}
						label="Marka: *"
						options={userBrands}
						valueMapper={(brand) => brand.id.toString()}
						displayNameMapper={(brand) => brand.name}
						error={errors.brandId?.message}
					/>
					<FileInput
						{...formRegister('apkFile')}
						noFilesLabel="Dodaj plik instalacyjny *"
						accept=".apk"
						multiple={false}
						error={errors.apkFile?.message}
					/>
					<FileInput
						{...formRegister('logoFile')}
						noFilesLabel="Dodaj logo (256x256 px) *"
						accept=".png"
						multiple={false}
						error={errors.logoFile?.message}
					/>
					<TextArea
						{...formRegister('description')}
						label="Opis:"
						error={errors.description?.message}
						rows={10}
						cols={70}
					/>
					<FileInput
						{...formRegister('appPicturesFiles')}
						noFilesLabel="Dodaj screenshoty"
						accept="image/png, image/gif, image/jpeg"
						multiple={true}
						error={errors.appPicturesFiles?.message}
					/>
				</AppFormTemplate>
			)}
		</>
	);
}
