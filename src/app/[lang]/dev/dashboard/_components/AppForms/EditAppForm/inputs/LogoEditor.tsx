import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import TextButton from '@/components/buttons/TextButton';
import FileInput, { FileInputProps } from '@/components/inputs/FileInput';
import GenericInputWrapper from '@/components/inputs/util/GenericInputWrapper';
import { mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';

export type LogoEditorProps = {
	currentLogoUrl: string;
	logoUnsetter: () => any;
} & Pick<FileInputProps, 'onChange' | 'onBlur' | 'error'>;

const LogoEditor = forwardRef<HTMLInputElement, LogoEditorProps>(function LogoEditor(
	{ currentLogoUrl, error, logoUnsetter, ...otherFileInputProps },
	ref
) {
	const t = useTranslations('AppForms');
	const [isChangingLogo, setIsChangingLogo] = useState(false);

	function cancelEditingLogo() {
		setIsChangingLogo(false);
		logoUnsetter();
	}

	return (
		<GenericInputWrapper label={t('labelLogoEditor')} labelHtmlFor="logo">
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
						onClick={cancelEditingLogo}
					>
						{t('cancelEditLogo')}
					</Button>
					<FileInput
						{...otherFileInputProps}
						ref={ref}
						noFilesLabel={t('labelLogoFile')}
						accept=".png"
						multiple={false}
						error={error}
					/>
				</div>
			)}
		</GenericInputWrapper>
	);
});

export default LogoEditor;
