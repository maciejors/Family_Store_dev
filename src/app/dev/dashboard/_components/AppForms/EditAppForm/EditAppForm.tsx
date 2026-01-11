'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete, mdiArrowULeftTop } from '@mdi/js';
import { editApp, getAppDetails } from '@/lib/supabase/database/apps';
import AppFormTemplate from '../AppFormTemplate';
import EditAppData, { editAppSchema } from '@/schemas/EditAppData';
import Button from '@/components/buttons/Button';
import TextButton from '@/components/buttons/TextButton';
import FileInput from '@/components/inputs/FileInput';
import TextInput from '@/components/inputs/TextInput';
import IconButton from '@/components/buttons/IconButton';
import TextArea from '@/components/inputs/TextArea';
import ErrorLabel from '@/components/inputs/util/ErrorLabel';
import GenericInputWrapper from '@/components/inputs/util/GenericInputWrapper';

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
			<GenericInputWrapper label="Logo aplikacji: *" labelHtmlFor="logo">
				{!isChangingLogo && (
					<div className="flex flex-row items-center gap-1">
						<a href={currentLogoUrl} target="_blank">
							<TextButton component="span" className="m-1">
								logo.png {/* It is always named that in the database */}
							</TextButton>
						</a>
						<IconButton
							id="logo"
							type="button"
							color="primary"
							onClick={() => setIsChangingLogo(true)}
							icon={<Icon path={mdiPencil} size={1} />}
						/>
					</div>
				)}
				{isChangingLogo && (
					<div className="flex flex-col gap-4 mt-2 w-full">
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
			</GenericInputWrapper>
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
			<GenericInputWrapper label="Screenshoty:">
				<ul className="flex flex-col mb-2 w-fit">
					{pictureNames.map((name, index) => {
						const isMarkedToDelete = picturesToDeleteNames?.includes(name) ?? false;
						return (
							<li className="flex items-center ml-2" key={index}>
								<a
									className="grow text-primary m-1"
									href={pictureUrls[index]}
									target="_blank"
								>
									<TextButton
										component="span"
										className={clsx(isMarkedToDelete && 'line-through')}
									>
										{name}
									</TextButton>
								</a>
								<IconButton
									type="button"
									color="primary"
									onClick={() => togglePictureToDelete(name)}
									aria-label={`${isMarkedToDelete ? 'undo ' : ''}delete picture ${name}`}
									icon={
										<Icon
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
			</GenericInputWrapper>
		</AppFormTemplate>
	);
}
