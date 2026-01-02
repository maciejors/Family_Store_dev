'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import '../forms.css';
import { addApp } from '@/lib/supabase/database/apps';
import { getBrandsForUser } from '@/lib/supabase/database/brands';
import FileInput from '../../../../../../components/inputs/FileInput';
import FormSubmitFeedback from '../FormSubmitFeedback';
import Spinner from '@/components/loading/Spinner';
import ConditionalSpinner from '@/components/loading/ConditionalSpinner';
import { notifyUsersOnNewApp } from '../actions';
import Brand from '@/models/Brand';
import Button from '@/components/buttons/Button';
import NewAppData, { newAppSchema } from '@/schemas/NewAppData';
import TextInput from '@/components/inputs/TextInput';
import TextArea from '@/components/inputs/TextArea';
import SelectBox from '@/components/inputs/SelectBox';

export type AddAppFormProps = {
	userUid: string;
};

export default function AddAppForm({ userUid }: AddAppFormProps) {
	const [isDataFetching, setisDataFetching] = useState(true);
	const [userBrands, setUserBrands] = useState<Brand[]>([]);

	const [isUploading, setIsUploading] = useState(false);
	const [isUploadError, setIsUploadError] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);

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

	/**
	 * Checks if the app is in the state that the app has been successfuly
	 * uploaded, to hide the upload button
	 * TODO: this is a temporary solution as there is plenty of code duplication
	 * across different app forms. We should address this in the future
	 */
	function isSuccess(): boolean {
		return !isUploading && wasSubmitted && !isUploadError;
	}

	async function onSubmitValid(newAppData: NewAppData) {
		setIsUploading(true);
		try {
			const appId = await addApp(newAppData);
			await notifyUsersOnNewApp(appId, newAppData.name);
			setIsUploadError(false);
		} catch (error) {
			console.error(error);
			setIsUploadError(true);
		} finally {
			setIsUploading(false);
			setWasSubmitted(true);
		}
	}

	return (
		<ConditionalSpinner isLoading={isDataFetching} extraSpinnerWrapperClasses="pt-8 pb-6">
			{!isDataFetching && userBrands.length === 0 && (
				<div className="flex flex-col items-center text-base p-4">
					<p>Brak marek powiązanych z tym kontem.</p>
					<p>Aby dodać aplikację, należy posiadać przynajmniej jedną markę.</p>
				</div>
			)}
			{!isDataFetching && userBrands.length > 0 && (
				<form
					onSubmit={handleSubmit(onSubmitValid)}
					className="app-form"
					aria-label="Add app form"
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
					<p className="required-asterisk">* pole wymagane</p>
					<FormSubmitFeedback
						wasSubmitted={wasSubmitted}
						isError={isUploadError}
						isLoading={isUploading}
					/>
					{!isSuccess() && (
						<Button className="submit-btn" type="submit" disabled={isUploading}>
							{isUploading ? <Spinner size={28} width={3} light /> : 'Dodaj aplikację'}
						</Button>
					)}
				</form>
			)}
		</ConditionalSpinner>
	);
}
