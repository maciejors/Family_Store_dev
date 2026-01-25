import IconButton from '@/components/buttons/IconButton';
import TextButton from '@/components/buttons/TextButton';
import GenericInputWrapper from '@/components/inputs/util/GenericInputWrapper';
import AppPicture from '@/models/AppPicture';
import { mdiArrowULeftTop, mdiDelete } from '@mdi/js';
import Icon from '@mdi/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export type PictureDeletePickerProps = {
	allPictures: AppPicture[];
	picturesToDeleteNames: string[];
	onPicturesToDeleteNamesChange: (pictureNames: string[]) => void;
	error?: string;
};

export default function PictureDeletePicker({
	allPictures,
	picturesToDeleteNames,
	onPicturesToDeleteNamesChange,
	error,
}: PictureDeletePickerProps) {
	const t = useTranslations('AppForms');

	function togglePictureToDelete(name: string) {
		let newNames = picturesToDeleteNames ?? [];
		if (newNames.includes(name)) {
			newNames = newNames.filter((n) => n !== name);
		} else {
			newNames = [...newNames, name];
		}
		onPicturesToDeleteNamesChange(newNames);
	}

	return (
		<GenericInputWrapper label="Screenshoty:" error={error}>
			<ul className="flex flex-col mb-2 w-fit">
				{allPictures.map(({ filename, url }, index) => {
					const isMarkedToDelete = picturesToDeleteNames?.includes(filename) ?? false;
					return (
						<li className="flex items-center ml-2" key={index}>
							<a className="grow text-primary m-1" href={url} target="_blank">
								<TextButton
									component="span"
									className={clsx(isMarkedToDelete && 'line-through')}
								>
									{filename}
								</TextButton>
							</a>
							<IconButton
								type="button"
								color="primary"
								onClick={() => togglePictureToDelete(filename)}
								aria-label={t(isMarkedToDelete ? 'undoDeletePicture' : 'deletePicture', {
									filename,
								})}
								icon={
									<Icon path={isMarkedToDelete ? mdiArrowULeftTop : mdiDelete} size={1} />
								}
							/>
						</li>
					);
				})}
			</ul>
		</GenericInputWrapper>
	);
}
