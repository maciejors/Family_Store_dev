'use client';

import { useEffect, useState } from 'react';
import './forms.css';
import { getAppUpdateDetails } from '@/app/db/database';

export default function UpdateAppForm() {
	const [file, setFile] = useState();
	const [version, setVersion] = useState('');
	const [changelog, setChangelog] = useState('');
	const [currentVersion, setCurrentVersion] = useState('');
	const [fileInputLabel, setFileInputLabel] = useState('Dodaj plik');

	useEffect(() => {
		getAppUpdateDetails().then((defaults) => {
			setChangelog(defaults.changelog);
			setCurrentVersion(defaults.version);
		});
	}, []);

	function onFileChanged(e) {
		const filePath = e.target.value;
		setFile(filePath);
		const filename = filePath.split('\\').pop();
		setFileInputLabel(filename);
	}

	function handleSubmit(e) {
		e.preventDefault();
		console.log(file);
		console.log(version);
		console.log(changelog);
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label className="file-input">
					{fileInputLabel}
					<input required type="file" accept=".apk" value={file} onChange={onFileChanged} />
				</label>
			</div>
			<div className="input-container">
				<label>Wersja:</label>
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
			<button type="submit"></button>
		</form>
	);
}
