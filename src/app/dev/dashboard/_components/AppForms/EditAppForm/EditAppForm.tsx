'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete, mdiArrowULeftTop } from '@mdi/js';
import '../forms.css';
import { editApp, getAppDetails } from '@/lib/supabase/database/apps';
import Button from '@/components/buttons/Button';
import EditAppData, { editAppSchema } from '@/schemas/EditAppData';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FileInput from '@/components/inputs/FileInput';
import TextInput from '@/components/inputs/TextInput';
import IconButton from '@/components/buttons/IconButton';
import TextArea from '@/components/inputs/TextArea';
import clsx from 'clsx';
import ErrorLabel from '@/components/inputs/util/ErrorLabel';
import AppFormTemplate from '../AppFormTemplate';

export type EditAppFormProps = {
	appId: number;
};

export default function EditAppForm({ appId }: EditAppFormProps) {
	const [isDataFetching, setisDataFetching] = useState(true);

	const [currentLogoUrl, setCurrentLogoUrl] = useState('');
	const [isChangingLogo, setIsChangingLogo] = useState(false);

	const [pictureUrls, setPictureUrls] = useState<string[]>([]);
	const [pictureNames, setPictureNames] = useState<string[]>([]);

	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		watch,
	} = useForm({
		resolver: zodResolver(editAppSchema),
	});

	const picturesToDeleteNames = watch('picturesToDeleteNames');

	function togglePictureToDelete(name: string) {
		let picturesToDeleteNames = getValues().picturesToDeleteNames ?? [];
		if (picturesToDeleteNames.includes(name)) {
			picturesToDeleteNames = picturesToDeleteNames.filter((n) => n !== name);
		} else {
			picturesToDeleteNames = [...picturesToDeleteNames, name];
		}
		setValue('picturesToDeleteNames', picturesToDeleteNames);
	}

	useEffect(() => {
		getAppDetails(appId).then((defaults) => {
			setValue('newName', defaults.name);
			setValue('newChangelog', defaults.changelog ?? '');
			setValue('newDescription', defaults.description ?? '');
			setCurrentLogoUrl(defaults.logoUrl ?? '');
			setPictureUrls(defaults.pictureUrls);
			setPictureNames(defaults.pictureNames);
			setisDataFetching(false);
		});
	}, [appId, setValue]);

	async function onSubmitValid(editAppData: EditAppData) {
		await editApp(appId, editAppData);
	}

	return (
		<AppFormTemplate
			onSubmit={handleSubmit(onSubmitValid)}
			name="Edit app form"
			isLoading={isDataFetching}
			submitBtnText="Zapisz zmiany"
		>
			<TextInput
				{...formRegister('newName')}
				label="Nazwa aplikacji: *"
				error={errors.newName?.message}
			/>
			<div className="input-container">
				<label htmlFor="logo">Logo aplikacji: *</label>
				{!isChangingLogo && (
					<div className="img-file-container">
						<a className="file-button" href={currentLogoUrl} target="_blank">
							logo.png {/* It is always named that in the database */}
						</a>
						<IconButton
							id="logo"
							type="button"
							onClick={() => setIsChangingLogo(true)}
							icon={<Icon className="icon-button" path={mdiPencil} size={1} />}
						/>
					</div>
				)}
				{isChangingLogo && (
					<div className="new-logo-input-container">
						<Button
							type="button"
							variant="secondary"
							className="w-fit"
							onClick={() => setIsChangingLogo(false)}
						>
							Anuluj edycję loga
						</Button>
						<FileInput
							{...formRegister('newLogoFile')}
							noFilesLabel="Dodaj logo (256x256 px) *"
							accept=".png"
							multiple={false}
							error={errors.newLogoFile?.message}
						/>
					</div>
				)}
			</div>
			<TextArea
				{...formRegister('newDescription')}
				label="Opis:"
				error={errors.newDescription?.message}
				rows={10}
				cols={70}
			/>
			<TextArea
				{...formRegister('newChangelog')}
				label="Lista zmian:"
				error={errors.newChangelog?.message}
				rows={10}
				cols={70}
			/>
			<div className="input-container">
				<label>Screenshoty:</label>
				<ul className="picture-list">
					{pictureNames.map((name, index) => {
						const isMarkedToDelete = picturesToDeleteNames?.includes(name) ?? false;
						return (
							<li className="picture-list-item" key={index}>
								<a
									className="picture-list-item-title file-button"
									href={pictureUrls[index]}
									target="_blank"
								>
									<span className={clsx(isMarkedToDelete && 'picture-marked-to-delete')}>
										{name}
									</span>
								</a>
								<IconButton
									type="button"
									onClick={() => togglePictureToDelete(name)}
									aria-label={`${isMarkedToDelete ? 'undo ' : ''}delete picture ${name}`}
									icon={
										<Icon
											className="icon-button"
											path={isMarkedToDelete ? mdiArrowULeftTop : mdiDelete}
											size={1}
										/>
									}
								/>
							</li>
						);
					})}
				</ul>
				{errors.picturesToDeleteNames && (
					<ErrorLabel>{errors.picturesToDeleteNames?.message}</ErrorLabel>
				)}
				<FileInput
					{...formRegister('newPicturesFiles')}
					noFilesLabel="Dodaj nowe screenshoty"
					accept="image/png, image/gif, image/jpeg"
					multiple={true}
					error={errors.newPicturesFiles?.message}
				/>
			</div>
		</AppFormTemplate>
	);
}
