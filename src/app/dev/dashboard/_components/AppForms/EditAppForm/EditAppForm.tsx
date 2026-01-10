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
import LogoEditor from './LogoEditor';
import AppDetails from '@/models/AppDetails';

export type EditAppFormProps = {
	appId: number;
};

export default function EditAppForm({ appId }: EditAppFormProps) {
	const [initAppDetails, setInitAppDetails] = useState<AppDetails>();

	const {
		register: formRegister,
		unregister: formUnregister,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		watch,
		reset,
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
		getAppDetails(appId).then((appDetails) => {
			setInitAppDetails(appDetails);
			reset({
				newName: appDetails.name,
				newChangelog: appDetails.changelog ?? '',
				newDescription: appDetails.description ?? '',
			});
		});
	}, [appId, setValue]);

	async function onSubmitValid(editAppData: EditAppData) {
		await editApp(appId, editAppData);
	}

	return (
		<AppFormTemplate
			onSubmit={handleSubmit(onSubmitValid)}
			name="Edit app form"
			isLoading={!initAppDetails}
			submitBtnText="Zapisz zmiany"
		>
			<TextInput
				{...formRegister('newName')}
				label="Nazwa aplikacji: *"
				error={errors.newName?.message}
			/>
			<LogoEditor
				{...formRegister('newLogoFile')}
				logoUnsetter={() => formUnregister('newLogoFile')}
				currentLogoUrl={initAppDetails?.logoUrl ?? ''}
				error={errors.newLogoFile?.message}
			/>
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
					{initAppDetails?.pictureNames.map((name, index) => {
						const isMarkedToDelete = picturesToDeleteNames?.includes(name) ?? false;
						return (
							<li className="flex items-center ml-2" key={index}>
								<a
									className="grow text-primary m-1"
									href={initAppDetails!.pictureUrls[index]}
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
