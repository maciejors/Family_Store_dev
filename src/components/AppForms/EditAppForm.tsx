'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete, mdiArrowULeftTop } from '@mdi/js';
import './forms.css';
import { editApp, getAppDetails } from '@/lib/supabase/database/apps';
import FormSubmitFeedback from './FormSubmitFeedback';
import Spinner from '@/components/Spinner';
import ConditionalSpinner from '@/components/ReplaceWithSpinnerIf';
import FileInput from './FileInput';

export default function EditAppForm({ appId }) {
	const [isDataFetching, setisDataFetching] = useState(true);

	const defaultLogoInputLabel = 'Dodaj nowe logo';
	const defaultPicturesInputLabel = 'Dodaj zdjęcia';

	const [logoInputLabel, setLogoInputLabel] = useState(defaultLogoInputLabel);
	const [picturesInputLabel, setPicturesInputLabel] = useState(defaultPicturesInputLabel);

	const [appName, setAppName] = useState('');

	const [logoUrl, setLogoUrl] = useState('');
	const [isChangingLogo, setIsChangingLogo] = useState(false);
	const [logoFile, setLogoFile] = useState<File | undefined>(undefined);

	const [changelog, setChangelog] = useState('');
	const [description, setDescription] = useState('');

	const [pictureUrls, setPictureUrls] = useState<string[]>([]);
	const [pictureNames, setPictureNames] = useState<string[]>([]);
	const [picturesToDeleteFlags, setPicturesToDeleteFlags] = useState<boolean[]>([]);
	const [newAppPicturesFiles, setNewAppPicturesFiles] = useState<File[]>([]);

	const [isUploading, setIsUploading] = useState(false);
	const [isUploadError, setIsUploadError] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);

	useEffect(() => {
		getAppDetails(appId).then((defaults) => {
			setAppName(defaults.name);
			setLogoUrl(defaults.logoUrl ?? '');
			setChangelog(defaults.changelog ?? '');
			setDescription(defaults.description ?? '');
			setPictureUrls(defaults.pictureUrls);
			setPictureNames(defaults.pictureNames);
			setPicturesToDeleteFlags(defaults.pictureUrls.map((_) => false));
			setisDataFetching(false);
		});
	}, [appId]);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setIsUploading(true);
		try {
			const picturesToDelete = pictureNames.filter(
				(_, index) => picturesToDeleteFlags[index]
			);
			await editApp(
				appId,
				appName.trim(),
				description.trim(),
				changelog.trim(),
				isChangingLogo ? logoFile : undefined,
				newAppPicturesFiles,
				picturesToDelete
			);
			setIsUploadError(false);
		} catch (error) {
			console.error(error);
			setIsUploadError(true);
		} finally {
			setIsUploading(false);
			setWasSubmitted(true);
		}
	}

	/**
	 * Checks if the app is in the state that the app has been successfuly
	 * uploaded, to hide the upload button
	 */
	function isSuccess(): boolean {
		return !isUploading && wasSubmitted && !isUploadError;
	}

	function showLogoEditor() {
		setIsChangingLogo(true);
	}

	function hideLogoEditor() {
		setIsChangingLogo(false);
	}

	function handleLogoFileChanged(files: File[]) {
		const newLogoFile = files[0]; // could be undefined but that's fine
		setLogoFile(newLogoFile);
	}

	function handleNewAppPicturesFilesChanged(files: File[]) {
		const newAppPicturesFiles = files;
		setNewAppPicturesFiles(newAppPicturesFiles);
	}

	function togglePictureToDelete(index: number) {
		const flagsCopy = [...picturesToDeleteFlags];
		flagsCopy[index] = !flagsCopy[index];
		setPicturesToDeleteFlags(flagsCopy);
	}

	return (
		<ConditionalSpinner isLoading={isDataFetching} extraSpinnerWrapperClasses="pt-8 pb-6">
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
					{!isChangingLogo && (
						<div className="img-file-container">
							<a className="file-button" href={logoUrl} target="_blank">
								logo.png {/* It is always named that in the database */}
							</a>
							<button type="button" onClick={showLogoEditor}>
								<Icon className="icon-button" path={mdiPencil} size={1} />
							</button>
						</div>
					)}
					{isChangingLogo && (
						<div className="new-logo-input-container">
							<button type="button" onClick={hideLogoEditor} className="btn btn-primary">
								Anuluj edycję loga
							</button>
							<FileInput
								defaultFileInputLabel="Dodaj logo (256x256 px) *"
								inputFileAccept=".png"
								inputFileMultiple={false}
								onFilesChanged={handleLogoFileChanged}
								inputFileRequired={isChangingLogo}
							/>
						</div>
					)}
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
							<li className="picture-list-item" key={index}>
								<a
									className="picture-list-item-title file-button"
									href={url}
									target="_blank"
								>
									<span
										className={
											picturesToDeleteFlags[index] ? 'picture-marked-to-delete' : ''
										}
									>
										{pictureNames[index]}
									</span>
								</a>
								<button type="button" onClick={() => togglePictureToDelete(index)}>
									<Icon
										className="icon-button"
										path={picturesToDeleteFlags[index] ? mdiArrowULeftTop : mdiDelete}
										size={1}
									/>
								</button>
							</li>
						))}
					</ul>
					<FileInput
						defaultFileInputLabel="Dodaj nowe screenshoty"
						inputFileRequired={false}
						inputFileAccept="image/png, image/gif, image/jpeg"
						inputFileMultiple={true}
						onFilesChanged={handleNewAppPicturesFilesChanged}
					/>
				</div>
				<p className="required-asterisk">* pole wymagane</p>
				<FormSubmitFeedback
					wasSubmitted={wasSubmitted}
					isError={isUploadError}
					isLoading={isUploading}
				/>
				{!isSuccess() && (
					<button
						className="btn btn-primary submit-btn"
						type="submit"
						disabled={isUploading}
					>
						{isUploading ? <Spinner size={28} width={3} light /> : 'Zapisz zmiany'}
					</button>
				)}
			</form>
		</ConditionalSpinner>
	);
}
