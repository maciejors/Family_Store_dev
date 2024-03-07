'use client';

import { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import { mdiPencil, mdiCancel } from '@mdi/js';
import './forms.css';
import { editApp, getAppDetails, updateApp } from '@/app/db/database';

export default function EditAppForm({ appId }) {
	const defaultLogoInputLabel = 'Dodaj nowe logo';
	const defaultPicturesInputLabel = 'Dodaj zdjęcia';

	const [logoInputLabel, setLogoInputLabel] = useState(defaultLogoInputLabel);
	const [picturesInputLabel, setPicturesInputLabel] = useState(defaultPicturesInputLabel);

	// const [file, setFile] = useState(undefined);
	// const [fileInput, setFileInput] = useState(''); // input needs a filename

	const [appName, setAppName] = useState('');

	const [logoUrl, setLogoUrl] = useState('');
	const [isChangingLogo, setIsChangingLogo] = useState(false);
	const [changelog, setChangelog] = useState('');
	const [description, setDescription] = useState('');
	const [pictureUrls, setPictureUrls] = useState([]);

	// const [downloadUrl, setDownloadUrl] = useState('');
	// const [version, setVersion] = useState('');

	useEffect(() => {
		getAppDetails(appId).then((defaults) => {
			setAppName(defaults.name);
			setLogoUrl(defaults.logoUrl ?? '');
			setChangelog(defaults.changelog ?? '');
			setDescription(defaults.description ?? '');
			setPictureUrls(defaults.pictureUrls ?? []);
			// setDownloadUrl(defaults.downloadUrl);
			// setVersion(defaults.version);
		});
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();
		await editApp(appId, appName, description, changelog);
	}

	function showLogoEditor() {
		setIsChangingLogo(true);
	}

	function hideLogoEditor() {
		setIsChangingLogo(false);
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
				<label>Logo aplikacji: *</label>
				<div className="img-file-container">
					<a className="file-button" href={logoUrl} target="_blank">
						logo.png {/* It is always named that in the database */}
					</a>
					<p className="coming-soon">(Możliwość edycji będzie dostępna wkrótce)</p>
				</div>
			</div>

			{/* <div className="input-container">
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
					<a className="btn btn-primary file-button" href={logoUrl}>
						Otwórz
					</a>
					<div className="btn btn-primary file-button" onClick={() => {}}>
						Dodaj plik
					</div>
				</div>
			</div> */}

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
							<a className="picture-list-item-title" href={url} target="_blank">
								Screenshot {index + 1}
							</a>
						</li>
					))}
				</ul>
				<p className="coming-soon">(Możliwość edycji będzie dostępna wkrótce)</p>
			</div>

			<p className="required-asterisk">* pole wymagane</p>

			<button className="btn btn-primary" type="submit">
				Zapisz zmiany
			</button>
		</form>
	);
}
