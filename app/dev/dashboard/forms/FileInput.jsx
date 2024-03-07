'use client';

import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiCheck, mdiUpload } from '@mdi/js';
import './forms.css';

export default function FileInput({
	defaultFileInputLabel,
	inputFileMultiple,
	inputFileAccept,
	onFilesChanged,
}) {
	const [fileInput, setFileInput] = useState(''); // input needs a filename
	const [fileInputLabel, setFileInputLabel] = useState(defaultFileInputLabel);

	function handleFilesChanged(e) {
		console.log(e);
		const newFiles = Array.from(e.target.files);
		setFileInput(e.target.value);
		onFilesChanged(newFiles);
		if (newFiles[0] === undefined) {
			setFileInputLabel(defaultFileInputLabel);
		} else {
			const newLabel = newFiles.map((f) => f.name).join(', ');
			setFileInputLabel(newLabel);
		}
	}

	return (
		<label className="file-input">
			<Icon path={fileInput === '' ? mdiUpload : mdiCheck} size={1.5} />
			<p>{fileInputLabel}</p>
			<input
				required
				type="file"
				accept={inputFileAccept}
				value={fileInput}
				onChange={handleFilesChanged}
				className="file-input"
				multiple={inputFileMultiple}
			/>
		</label>
	);
}
