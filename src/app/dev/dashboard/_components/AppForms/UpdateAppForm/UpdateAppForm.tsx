'use client';

import React, { useEffect, useState } from 'react';
import '../forms.css';
import { getAppUpdateDetails, updateApp } from '@/lib/supabase/database/apps';
import FileInput from '../../../../../../components/inputs/FileInput';
import FormSubmitFeedback from '../FormSubmitFeedback';
import Spinner from '@/components/loading/Spinner';
import ConditionalSpinner from '@/components/loading/ConditionalSpinner';
import { notifyUsersOnAppUpdate } from '../actions';
import Button from '@/components/buttons/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import UpdateAppData, { updateAppSchema } from '@/schemas/UpdateAppData';
import TextInput from '@/components/inputs/TextInput';
import TextArea from '@/components/inputs/TextArea';
import { ZodError } from 'zod';

export type UpdateAppFormProps = {
	appId: number;
};

export default function UpdateAppForm({ appId }: UpdateAppFormProps) {
	const [isDataFetching, setisDataFetching] = useState(true);
	const [appName, setAppName] = useState('');
	const [currentVersion, setCurrentVersion] = useState('');

	const [isUploading, setIsUploading] = useState(false);
	const [isUploadError, setIsUploadError] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);

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
		setIsUploading(true);
		try {
			await updateApp(appId, updateAppData);
			await notifyUsersOnAppUpdate(appId, appName, updateAppData.newVersion);
			setIsUploadError(false);
		} catch (error) {
			console.error(error);
			setIsUploadError(true);
		} finally {
			setIsUploading(false);
			setWasSubmitted(true);
		}
	}

	/**
	 * Checks if the app is in the state that the app has been successfuly
	 * uploaded, to hide the upload button
	 */
	function isSuccess(): boolean {
		return !isUploading && wasSubmitted && !isUploadError;
	}

	return (
		<ConditionalSpinner isLoading={isDataFetching} extraSpinnerWrapperClasses="pt-8 pb-6">
			<form
				onSubmit={handleSubmit(onSubmitValid)}
				className="app-form"
				aria-label="Update app form"
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
				<p className="required-asterisk">* pole wymagane</p>
				<FormSubmitFeedback
					wasSubmitted={wasSubmitted}
					isError={isUploadError}
					isLoading={isUploading}
				/>
				{!isSuccess() && (
					<Button className="submit-btn" type="submit" disabled={isUploading}>
						{isUploading ? <Spinner size={28} width={3} light /> : 'Wydaj aktualizację'}
					</Button>
				)}
			</form>
		</ConditionalSpinner>
	);
}
