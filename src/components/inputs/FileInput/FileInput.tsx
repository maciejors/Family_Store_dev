'use client';

import React, { ChangeEvent, forwardRef, useId, useState } from 'react';
import Icon from '@mdi/react';
import { mdiCheck, mdiUpload } from '@mdi/js';
import styles from './styles.module.css';
import ErrorLabel from '../util/ErrorLabel';

export type FileInputProps = Pick<
	React.InputHTMLAttributes<HTMLInputElement>,
	'onChange' | 'onBlur' | 'multiple' | 'accept'
> & {
	noFilesLabel: string;
	error?: string;
};

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
	{ noFilesLabel, error, onChange, ...inputProps },
	ref
) {
	const id = useId();
	const [fileNames, setFileNames] = useState<string[]>([]);

	function onChangeWrapper(e: ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? []);
		setFileNames(files.map((f) => f.name));
		onChange?.(e);
	}

	return (
		<label className={styles['file-input']} htmlFor={id}>
			<Icon path={fileNames.length === 0 ? mdiUpload : mdiCheck} size={1.5} />
			{fileNames.length > 0 ? (
				fileNames.map((label) => <p key={label}>{label}</p>)
			) : (
				<p>{noFilesLabel}</p>
			)}
			{error && <ErrorLabel>{error}</ErrorLabel>}
			<input ref={ref} id={id} type="file" onChange={onChangeWrapper} {...inputProps} />
		</label>
	);
});

export default FileInput;
