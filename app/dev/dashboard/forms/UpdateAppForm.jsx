'use client';

import { useEffect, useState } from 'react';
import './forms.css';
import { getAppUpdateDetails, updateApp } from '@/app/db/database';
import Icon from '@mdi/react';
import { mdiCheck, mdiUpload } from '@mdi/js';

export default function UpdateAppForm({ appId }) {
	const defaultFileInputLabel = 'Dodaj plik';

	const [file, setFile] = useState(undefined);
	const [fileInput, setFileInput] = useState(''); // input needs a filename
	const [version, setVersion] = useState('');
	const [changelog, setChangelog] = useState('');
	const [currentVersion, setCurrentVersion] = useState('');
	const [fileInputLabel, setFileInputLabel] = useState(defaultFileInputLabel);

	useEffect(() => {
		getAppUpdateDetails(appId).then((defaults) => {
			setChangelog(defaults.changelog ?? '');
			setCurrentVersion(defaults.version);
		});
	}, [appId]);

	function onFileChanged(e) {
		const newFile = e.target.files[0];
		setFileInput(e.target.value);
		setFile(newFile);
		if (newFile !== undefined) {
			setFileInputLabel(newFile.name);
		} else {
			setFileInputLabel(defaultFileInputLabel);
		}
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
			<label className="file-input">
				<Icon path={file === undefined ? mdiUpload : mdiCheck} size={1.5} />
				<p>{fileInputLabel}</p>
				<input
					required
					type="file"
					accept=".apk"
					value={fileInput}
					onChange={onFileChanged}
					className="file-input"
				/>
			</label>
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
