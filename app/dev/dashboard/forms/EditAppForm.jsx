'use client';

import { useEffect, useState } from 'react';
import './forms.css';
import { getAppDetails, updateApp } from '@/app/db/database';

export default function EditAppForm({ appId }) {
	const defaultFileInputLabel = 'Dodaj plik';

	const [file, setFile] = useState(undefined);
	const [fileInput, setFileInput] = useState(''); // input needs a filename

	const [appName, setAppName] = useState('');
	const [downloadUrl, setDownloadUrl] = useState('');
	const [logoUrl, setLogoUrl] = useState('');
	const [version, setVersion] = useState('');
	const [changelog, setChangelog] = useState('');
	const [description, setDescription] = useState('');
	const [pictureUrls, setPictureUrls] = useState([]);

	const [fileInputLabel, setFileInputLabel] = useState(defaultFileInputLabel);

	useEffect(() => {
		getAppDetails(appId).then((defaults) => {
			setAppName(defaults.name);
			setDownloadUrl(defaults.downloadUrl);
			setLogoUrl(defaults.logoUrl ?? '');
			setVersion(defaults.version);
			setChangelog(defaults.changelog ?? '');
			setDescription(defaults.description ?? '');
			setPictureUrls(defaults.pictureUrls ?? []);
		});
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();
		
	}

	function openUrl(url) {
		window.open(url, '_blank');
	}

	return (
		<form onSubmit={handleSubmit} className="app-form">
			<div className="input-container">
				<label>
					Nazwa aplikacji: <span className="required-asterisk">*</span>
				</label>
				<input
					required
					type="text"
					value={appName}
					onChange={(e) => setAppName(e.target.value)}
					className="text-input"
				/>
			</div>

			<div className="input-container">
				<label>Logo aplikacji:</label>
				<div className="file-container">
					<button
						className="btn btn-primary file-button"
						onClick={() => {
							openUrl(logoUrl);
						}}
					>
						Otwórz
					</button>
					<button className="btn btn-primary file-button" onClick={() => {}}>
						Dodaj plik
					</button>
				</div>
			</div>

			<div className="input-container">
				<label>
					Wersja: <span className="required-asterisk">*</span>
				</label>
				<input
					required
					type="text"
					value={version}
					onChange={(e) => setVersion(e.target.value)}
					className="text-input"
				/>
			</div>

			<div className="input-container">
				<label>Plik instalacyjny:</label>
				<div className="file-container">
					<button
						className="btn btn-primary file-button"
						onClick={() => {
							openUrl(logoUrl);
						}}
					>
						Otwórz
					</button>
					<button className="btn btn-primary file-button" onClick={() => {}}>
						Dodaj plik
					</button>
				</div>
			</div>

			<div className="input-container">
				<label>Opis:</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="text-input"
					rows={10}
					cols={70}
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

			<div className="input-container">
				<label>Screenshoty:</label>
				<ul className="picture-list">
					{pictureUrls.map((url, index) => (
						<li className="picture-list-item">
							<span className="picture-list-item-title">Screenshot {index + 1}:</span>
							<button
								className="btn btn-primary file-button"
								onClick={() => {
									openUrl(url);
								}}
							> 
								Otwórz
							</button>
						</li>
					))}
				</ul>
			</div>

			<p className="required-asterisk">* pole wymagane</p>

			<button className="btn btn-primary" type="submit">
				Zapisz zmiany
			</button>
		</form>
	);
}
