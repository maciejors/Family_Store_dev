import Spinner from '@/app/shared/Spinner';
import './dashboard.css';

export default function ReplaceWithSpinnerIf({
	children,
	condition,
	extraSpinnerWrapperClasses = '',
	spinnerSize = 64,
	spinnerWidth = 6,
}) {
	return (
		<>
			{condition && (
				<div className={`spinner-container py-8 ${extraSpinnerWrapperClasses}`}>
					<Spinner size={spinnerSize} width={spinnerWidth} />
				</div>
			)}
			{!condition && children}
		</>
	);
}
