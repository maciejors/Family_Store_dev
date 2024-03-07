import './forms.css';
import Icon from '@mdi/react';
import { mdiClose, mdiCheck } from '@mdi/js';

export default function FormSubmitFeedback({ wasSubmitted, isLoading, isError }) {
	return (
		<>
			{!isLoading && isError && wasSubmitted && (
				<div className="submit-message-container submit-error">
					<Icon path={mdiClose} size={1} />
					<p>Wystąpił błąd</p>
				</div>
			)}
			{!isLoading && !isError && wasSubmitted && (
				<div className="submit-message-container submit-success">
					<Icon path={mdiCheck} size={1} />
					<p>Sukces</p>
				</div>
			)}
		</>
	);
}
