'use client';

import { useEffect, useState } from 'react';
import './forms.css';
import { getAppUpdateDetails, updateApp } from '@/app/db/database';
import FileInput from './FileInput';

export default function UpdateAppForm({ appId }) {
	const [file, setFile] = useState(undefined);
	const [version, setVersion] = useState('');
	const [changelog, setChangelog] = useState('');
	const [currentVersion, setCurrentVersion] = useState('');

	useEffect(() => {
		getAppUpdateDetails(appId).then((defaults) => {
			setChangelog(defaults.changelog ?? '');
			setCurrentVersion(defaults.version);
		});
	}, [appId]);

	function handleApkFileChanged(files) {
		const apkFile = files[0]; // could be undefined but that's fine
		setFile(apkFile);
	}

	function onUploadStarted() {
		console.log('file upload started!');
	}

	function onUploadFinished() {
		console.log('file upload finished!');
	}

	async function handleSubmit(e) {
		e.preventDefault();
		onUploadStarted();
		await updateApp(appId, file, version, changelog);
		onUploadFinished();
	}

	return (
		<form onSubmit={handleSubmit} className="app-form">
			<FileInput
				defaultFileInputLabel="Dodaj plik"
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
			<button className="btn btn-primary" type="submit">
				Wydaj aktualizację
			</button>
		</form>
	);
}
