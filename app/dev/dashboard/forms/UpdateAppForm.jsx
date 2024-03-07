'use client';

import { useEffect, useState } from 'react';
import './forms.css';
import { getAppUpdateDetails, updateApp } from '@/app/db/database';
import FileInput from './FileInput';
import FormSubmitFeedback from './FormSubmitFeedback';
import Spinner from '@/app/shared/Spinner';

export default function UpdateAppForm({ appId }) {
	const [isDataFetching, setisDataFetching] = useState(true);

	const [file, setFile] = useState(undefined);
	const [version, setVersion] = useState('');
	const [changelog, setChangelog] = useState('');
	const [currentVersion, setCurrentVersion] = useState('');

	const [isUploading, setIsUploading] = useState(false);
	const [isUploadError, setIsUploadError] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);

	useEffect(() => {
		getAppUpdateDetails(appId).then((defaults) => {
			setChangelog(defaults.changelog ?? '');
			setCurrentVersion(defaults.version);
			setisDataFetching(false);
		});
	}, [appId]);

	function handleApkFileChanged(files) {
		const apkFile = files[0]; // could be undefined but that's fine
		setFile(apkFile);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setIsUploading(true);
		try {
			await updateApp(appId, file, version, changelog);
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
		<>
			{isDataFetching && (
				<div className="spinner-container py-8">
					<Spinner size={64} width={6} />
				</div>
			)}
			{!isDataFetching && (
				<form onSubmit={handleSubmit} className="app-form">
					<FileInput
						defaultFileInputLabel="Dodaj plik"
						inputFileAccept=""
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
					<button className="btn btn-primary submit-btn" type="submit" disabled={isUploading}>
						{isUploading ? <Spinner size={28} width={3} light /> : 'Wydaj aktualizację'}
					</button>
					<FormSubmitFeedback
						wasSubmitted={wasSubmitted}
						isError={isUploadError}
						isLoading={isUploading}
					/>
				</form>
			)}
		</>
	);
}
