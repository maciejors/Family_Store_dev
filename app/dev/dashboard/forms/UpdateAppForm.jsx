'use client';

import { useEffect, useState } from 'react';
import './forms.css';
import { getAppUpdateDetails } from '@/app/db/database';

export default function UpdateAppForm() {
	const [file, setFile] = useState();
	const [version, setVersion] = useState('');
	const [changelog, setChangelog] = useState('');
	const [currentVersion, setCurrentVersion] = useState('');

	useEffect(() => {
		getAppUpdateDetails().then((defaults) => {
			setChangelog(defaults.changelog);
			setCurrentVersion(defaults.version);
		});
	}, []);

	function handleSubmit(e) {
		e.preventDefault();
		console.log(file);
		console.log(version);
		console.log(changelog);
	}

	return (
		<form action="" onSubmit={handleSubmit}>
			<div>
				<label htmlFor="upload-apk">dsadsa</label>
				{/*TODO: make this input work*/}
				<input
					id="upload-apk"
					name="upload-apk"
					required
					type="file"
					accept=".apk"
					onChange={(e) => setFile(e.target.value)}
				/>
			</div>
			<div className="input-container">
				<label>Wersja:</label>
				<input
					required
					type="text"
					value={version}
					onChange={(e) => setVersion(e.target.value)}
					placeholder={currentVersion}
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
