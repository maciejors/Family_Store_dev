'use client';

import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiCheck, mdiUpload } from '@mdi/js';
import '../forms.css';

export default function FileInput({
	defaultFileInputLabel,
	inputFileRequired = true,
	inputFileMultiple = false,
	inputFileAccept,
	onFilesChanged,
}) {
	const [fileInput, setFileInput] = useState(''); // input needs a filename
	const [fileInputLabels, setFileInputLabels] = useState([defaultFileInputLabel]);

	function handleFilesChanged(e) {
		console.log(e);
		const newFiles = Array.from(e.target.files);
		setFileInput(e.target.value);
		onFilesChanged(newFiles);
		if (newFiles[0] === undefined) {
			setFileInputLabels([defaultFileInputLabel]);
		} else {
			const newLabel = newFiles.map((f) => f.name);
			setFileInputLabels(newLabel);
		}
	}

	return (
		<label className="file-input">
			<Icon path={fileInput === '' ? mdiUpload : mdiCheck} size={1.5} />
			{fileInputLabels.map((label) => (
				<p key={label}>{label}</p>
			))}
			<input
				required={inputFileRequired}
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
