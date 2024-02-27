'use client';

import { useEffect, useState } from 'react';
import './forms.css';
import { getAppUpdateDetails, updateApp } from '@/app/db/database';
import Icon from '@mdi/react';
import { mdiCheck, mdiUpload } from '@mdi/js';

export default function UpdateAppForm({ appId }) {
	const defaultFileInputLabel = 'Dodaj plik';

	const [file, setFile] = useState('');
	const [version, setVersion] = useState('');
	const [changelog, setChangelog] = useState('');
	const [currentVersion, setCurrentVersion] = useState('');
	const [fileInputLabel, setFileInputLabel] = useState(defaultFileInputLabel);

	useEffect(() => {
		getAppUpdateDetails(appId).then((defaults) => {
			setChangelog(defaults.changelog);
			setCurrentVersion(defaults.version);
		});
	}, []);

	function onFileChanged(e) {
		const filePath = e.target.value;
		setFile(filePath);
		const filename = filePath.split('\\').pop();
		if (filename !== '') {
			setFileInputLabel(filename);
		} else {
			setFileInputLabel(defaultFileInputLabel);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		await updateApp(appId, file, version, changelog);
	}

	return (
		<form onSubmit={handleSubmit} className="app-form">
			<label className="file-input">
				<Icon path={file === '' ? mdiUpload : mdiCheck} size={1.5} />
				<p>{fileInputLabel}</p>
				<input
					required
					type="file"
					accept=".apk"
					value={file}
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
