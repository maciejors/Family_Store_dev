'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import './forms.css';
import { addApp } from '@/lib/supabase/database/apps';
import { getBrandsForUser } from '@/lib/supabase/database/brands';
import FileInput from './FileInput';
import FormSubmitFeedback from './FormSubmitFeedback';
import Spinner from '@/components/loading/Spinner';
import ConditionalSpinner from '@/components/loading/ConditionalSpinner';
import { notifyUsersOnNewApp } from './actions';
import BrandBase from '@/models/Brand';
import Button from '../../../../../components/buttons/Button';

export default function AddAppForm({ userUid }) {
	const [isDataFetching, setisDataFetching] = useState(true);

	const [appName, setAppName] = useState('');
	const [apkFile, setApkFile] = useState<File | undefined>(undefined);
	const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
	const [appPicturesFiles, setAppPicturesFiles] = useState<File[]>([]);
	const [version, setVersion] = useState('1.0.0');
	const [description, setDescription] = useState('');
	const [brandId, setBrandId] = useState<number | undefined>(undefined);
	const [userBrands, setUserBrands] = useState<BrandBase[]>([]);

	const [isUploading, setIsUploading] = useState(false);
	const [isUploadError, setIsUploadError] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);

	useEffect(() => {
		getBrandsForUser(userUid).then((brands) => {
			setUserBrands(brands);
			if (brands.length > 0) {
				setBrandId(brands[0].id);
			}
			setisDataFetching(false);
		});
	}, [userUid]);

	/**
	 * Checks if the app is in the state that the app has been successfuly
	 * uploaded, to hide the upload button
	 * TODO: this is a temporary solution as there is plenty of code duplication
	 * across different app forms. We should address this in the future
	 */
	function isSuccess(): boolean {
		return !isUploading && wasSubmitted && !isUploadError;
	}

	function handleApkFileChanged(files: File[]) {
		const newLogoFile = files[0]; // could be undefined but that's fine
		setApkFile(newLogoFile);
	}

	function handleLogoFileChanged(files: File[]) {
		const newLogoFile = files[0]; // could be undefined but that's fine
		setLogoFile(newLogoFile);
	}

	function handleAppPicturesFilesChanged(files: File[]) {
		const newAppPicturesFiles = files;
		setAppPicturesFiles(newAppPicturesFiles);
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setIsUploading(true);
		try {
			const appId = await addApp(
				appName.trim(),
				brandId!,
				apkFile!,
				logoFile!,
				version.trim(),
				description.trim(),
				appPicturesFiles
			);
			await notifyUsersOnNewApp(appId, appName.trim());
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
		<ConditionalSpinner isLoading={isDataFetching} extraSpinnerWrapperClasses="pt-8 pb-6">
			{userBrands.length === 0 && (
				<div className="flex flex-col items-center text-base p-4">
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
							onChange={(e) => setBrandId(parseInt(e.target.value))}
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
						defaultFileInputLabel="Dodaj plik instalacyjny *"
						inputFileAccept=".apk"
						inputFileMultiple={false}
						onFilesChanged={handleApkFileChanged}
					/>
					<FileInput
						defaultFileInputLabel="Dodaj logo (256x256 px) *"
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
					<FormSubmitFeedback
						wasSubmitted={wasSubmitted}
						isError={isUploadError}
						isLoading={isUploading}
					/>
					{!isSuccess() && (
						<Button className="submit-btn" type="submit" disabled={isUploading}>
							{isUploading ? <Spinner size={28} width={3} light /> : 'Dodaj aplikację'}
						</Button>
					)}
				</form>
			)}
		</ConditionalSpinner>
	);
}
