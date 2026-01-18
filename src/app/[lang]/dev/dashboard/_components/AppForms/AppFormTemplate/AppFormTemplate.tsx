import React, { ReactNode, useState } from 'react';
import clsx from 'clsx';
import Icon from '@mdi/react';
import { mdiClose, mdiCheck } from '@mdi/js';
import Button from '@/components/buttons/Button';
import ConditionalSpinner from '@/components/loading/ConditionalSpinner';
import Spinner from '@/components/loading/Spinner';

export type AppFormTemplateProps = {
	children: ReactNode;
	isLoading?: boolean;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<any>;
	name: string;
	submitBtnText: string;
};

export default function AppFormTemplate({
	children,
	isLoading,
	onSubmit,
	name,
	submitBtnText,
}: AppFormTemplateProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [isUploadError, setIsUploadError] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);

	async function onSubmitWrapper(event: React.FormEvent<HTMLFormElement>) {
		setIsUploading(true);
		try {
			await onSubmit(event);
			setIsUploadError(false);
		} catch (error) {
			console.error(error);
			setIsUploadError(true);
		} finally {
			setIsUploading(false);
			setWasSubmitted(true);
		}
	}

	function isSuccess(): boolean {
		return !isUploading && wasSubmitted && !isUploadError;
	}

	const submitFeedbackClassName = clsx(
		'flex flex-row gap-1 items-center text-sm',
		isUploadError ? 'text-red-500' : 'text-green-500'
	);

	return (
		<ConditionalSpinner isLoading={isLoading} extraSpinnerWrapperClasses="pt-8 pb-6">
			<form
				onSubmit={onSubmitWrapper}
				className="flex flex-col items-center gap-4 p-2 mt-4 text-lg"
				aria-label={name}
			>
				{children}
				<p className="text-red-600 w-full text-base">* pole wymagane</p>
				{!isUploading && wasSubmitted && (
					<div className={submitFeedbackClassName}>
						{isUploadError ? (
							<>
								<Icon path={mdiClose} size={1} />
								<p>Wystąpił błąd</p>
							</>
						) : (
							<>
								<Icon path={mdiCheck} size={1} />
								<p>Sukces</p>
							</>
						)}
					</div>
				)}
				{!isSuccess() && (
					<Button className="w-64 h-12" type="submit" disabled={isUploading}>
						{isUploading ? <Spinner size={28} width={3} light /> : submitBtnText}
					</Button>
				)}
			</form>
		</ConditionalSpinner>
	);
}
