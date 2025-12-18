'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import './forms.css';
import { getAppUpdateDetails, updateApp } from '@/lib/supabase/database/apps';
import FileInput from './FileInput';
import FormSubmitFeedback from './FormSubmitFeedback';
import Spinner from '@/components/loading/Spinner';
import ConditionalSpinner from '@/components/loading/ConditionalSpinner';
import { notifyUsersOnAppUpdate } from './actions';
import Button from '@/components/buttons/Button';

export default function UpdateAppForm({ appId }) {
	const [isDataFetching, setisDataFetching] = useState(true);

	const [file, setFile] = useState<File | undefined>(undefined);
	const [version, setVersion] = useState('');
	const [appName, setAppName] = useState('');
	const [changelog, setChangelog] = useState('');
	const [currentVersion, setCurrentVersion] = useState('');

	const [isUploading, setIsUploading] = useState(false);
	const [isUploadError, setIsUploadError] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);

	useEffect(() => {
		getAppUpdateDetails(appId).then((defaults) => {
			setChangelog(defaults.changelog ?? '');
			setCurrentVersion(defaults.version);
			setAppName(defaults.appName);
			setisDataFetching(false);
		});
	}, [appId]);

	function handleApkFileChanged(files: File[]) {
		const newApkFile = files[0]; // could be undefined but that's fine
		setFile(newApkFile);
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setIsUploading(true);
		try {
			await updateApp(appId, file!, version.trim(), changelog.trim());
			await notifyUsersOnAppUpdate(appId, appName.trim(), version.trim());
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
			<form onSubmit={handleSubmit} className="app-form">
				<FileInput
					defaultFileInputLabel="Dodaj plik instalacyjny *"
					inputFileAccept=".apk"
					inputFileMultiple={false}
					onFilesChanged={handleApkFileChanged}
				/>
				<div className="input-container">
					<label>
						Wersja: <span className="required-asterisk">*</span>
					</label>
					<input
						required
						type="text"
						value={version}
						onChange={(e) => setVersion(e.target.value)}
						placeholder={`Obecna wersja: ${currentVersion}`}
						className="text-input"
					/>
				</div>
				<div className="input-container">
					<label>Lista zmian:</label>
					<textarea
						value={changelog}
						onChange={(e) => setChangelog(e.target.value)}
						className="text-input"
						rows={10}
						cols={70}
					/>
				</div>
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
