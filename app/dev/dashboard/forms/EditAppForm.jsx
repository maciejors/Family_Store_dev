'use client';

import { useEffect, useState } from 'react';
import './forms.css';
import { editApp, getAppDetails } from '@/app/db/database';
import FormSubmitFeedback from './FormSubmitFeedback';
import Spinner from '@/app/shared/Spinner';
import ReplaceWithSpinnerIf from '../ReplaceWithSpinnerIf';

export default function EditAppForm({ appId }) {
	const [isDataFetching, setisDataFetching] = useState(true);

	// const defaultLogoInputLabel = 'Dodaj nowe logo';
	// const defaultPicturesInputLabel = 'Dodaj zdjęcia';

	// const [logoInputLabel, setLogoInputLabel] = useState(defaultLogoInputLabel);
	// const [picturesInputLabel, setPicturesInputLabel] = useState(defaultPicturesInputLabel);

	// const [file, setFile] = useState(undefined);
	// const [fileInput, setFileInput] = useState(''); // input needs a filename

	const [appName, setAppName] = useState('');

	const [logoUrl, setLogoUrl] = useState('');
	// const [isChangingLogo, setIsChangingLogo] = useState(false);
	const [changelog, setChangelog] = useState('');
	const [description, setDescription] = useState('');
	const [pictureUrls, setPictureUrls] = useState([]);

	// const [downloadUrl, setDownloadUrl] = useState('');
	// const [version, setVersion] = useState('');

	const [isUploading, setIsUploading] = useState(false);
	const [isUploadError, setIsUploadError] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);

	useEffect(() => {
		getAppDetails(appId).then((defaults) => {
			setAppName(defaults.name);
			setLogoUrl(defaults.logoUrl ?? '');
			setChangelog(defaults.changelog ?? '');
			setDescription(defaults.description ?? '');
			setPictureUrls(defaults.pictureUrls ?? []);
			// setDownloadUrl(defaults.downloadUrl);
			// setVersion(defaults.version);
			setisDataFetching(false);
		});
	}, [appId]);

	async function handleSubmit(e) {
		e.preventDefault();
		setIsUploading(true);
		try {
			await editApp(appId, appName, description, changelog);
			setIsUploadError(false);
		} catch (error) {
			console.error(error);
			setIsUploadError(true);
		} finally {
			setIsUploading(false);
			setWasSubmitted(true);
		}
	}

	// function showLogoEditor() {
	// 	setIsChangingLogo(true);
	// }

	// function hideLogoEditor() {
	// 	setIsChangingLogo(false);
	// }

	return (
		<ReplaceWithSpinnerIf condition={isDataFetching} extraSpinnerWrapperClasses="pt-8 pb-6">
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
					<label>
						Logo aplikacji: <span className="required-asterisk">*</span>
					</label>
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
							<li className="picture-list-item" key={index}>
								<a className="picture-list-item-title" href={url} target="_blank">
									Screenshot {index + 1}
								</a>
							</li>
						))}
					</ul>
					<p className="coming-soon">(Możliwość edycji będzie dostępna wkrótce)</p>
				</div>

				<p className="required-asterisk">* pole wymagane</p>

				<button className="btn btn-primary submit-btn" type="submit" disabled={isUploading}>
					{isUploading ? <Spinner size={28} width={3} light /> : 'Zapisz zmiany'}
				</button>
				<FormSubmitFeedback
					wasSubmitted={wasSubmitted}
					isError={isUploadError}
					isLoading={isUploading}
				/>
			</form>
		</ReplaceWithSpinnerIf>
	);
}
