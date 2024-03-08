'use client';

import { useEffect, useState } from 'react';
import '../forms.css';
import { addApp, getBrandsForUser } from '@/app/db/database';
import FileInput from './FileInput';
import FormSubmitFeedback from './FormSubmitFeedback';
import Spinner from '@/app/shared/Spinner';
import ReplaceWithSpinnerIf from '../ReplaceWithSpinnerIf';

export default function AddAppForm({ userUid }) {
	const [isDataFetching, setisDataFetching] = useState(true);

	const [appName, setAppName] = useState('');
	const [apkFile, setApkFile] = useState(undefined);
	const [logoFile, setLogoFile] = useState(undefined);
	const [appPicturesFiles, setAppPicturesFiles] = useState([]);
	const [version, setVersion] = useState('1.0.0');
	const [description, setDescription] = useState('');
	const [brandId, setBrandId] = useState(undefined);
	const [userBrands, setUserBrands] = useState([]);

	const [isUploading, setIsUploading] = useState(false);
	const [isUploadError, setIsUploadError] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);

	useEffect(() => {
		getBrandsForUser(userUid).then((brands) => {
			setUserBrands(brands);
			setBrandId(brands[0].id);
			setisDataFetching(false);
		});
	}, [userUid]);

	function handleApkFileChanged(files) {
		const newLogoFile = files[0]; // could be undefined but that's fine
		setApkFile(newLogoFile);
	}

	function handleLogoFileChanged(files) {
		const newLogoFile = files[0]; // could be undefined but that's fine
		setLogoFile(newLogoFile);
	}

	function handleAppPicturesFilesChanged(files) {
		const newAppPicturesFiles = files;
		setAppPicturesFiles(newAppPicturesFiles);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setIsUploading(true);
		try {
			await addApp(appName, brandId, apkFile, logoFile, version, description, appPicturesFiles);
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
		<ReplaceWithSpinnerIf condition={isDataFetching} extraSpinnerWrapperClasses="pt-8 pb-6">
			{userBrands.length === 0 && (
				<div className="add-app-no-brands-info-container">
					<p>Brak marek powiązanych z tym kontem.</p>
					<p>Aby dodać aplikację, należy posiadać przynajmniej jedną markę.</p>
				</div>
			)}
			{userBrands.length > 0 && (
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
							Wersja: <span className="required-asterisk">*</span>
						</label>
						<input
							required
							type="text"
							value={version}
							onChange={(e) => setVersion(e.target.value)}
							placeholder={`np. 1.0.0`}
							className="text-input"
						/>
					</div>
					<div className="input-container">
						<label>
							Marka: <span className="required-asterisk">*</span>
						</label>
						<select
							value={brandId}
							onChange={(e) => setBrandId(e.target.value)}
							required
							className="text-input"
						>
							{userBrands.map((brand) => (
								<option key={brand.id} value={brand.id}>
									{brand.name}
								</option>
							))}
						</select>
					</div>
					<FileInput
						defaultFileInputLabel="Dodaj plik instalacyjny"
						inputFileAccept=".apk"
						inputFileMultiple={false}
						onFilesChanged={handleApkFileChanged}
					/>
					<FileInput
						defaultFileInputLabel="Dodaj logo (256x256 px)"
						inputFileAccept=".png"
						inputFileMultiple={false}
						onFilesChanged={handleLogoFileChanged}
					/>
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
					<FileInput
						defaultFileInputLabel="Dodaj screenshoty"
						inputFileRequired={false}
						inputFileAccept="image/png, image/gif, image/jpeg"
						inputFileMultiple={true}
						onFilesChanged={handleAppPicturesFilesChanged}
					/>
					<p className="required-asterisk">* pole wymagane</p>
					<button className="btn btn-primary submit-btn" type="submit" disabled={isUploading}>
						{isUploading ? <Spinner size={28} width={3} light /> : 'Dodaj aplikację'}
					</button>
					<FormSubmitFeedback
						wasSubmitted={wasSubmitted}
						isError={isUploadError}
						isLoading={isUploading}
					/>
				</form>
			)}
		</ReplaceWithSpinnerIf>
	);
}
