import React from 'react';
import Spinner from './Spinner';

export default function ConditionalSpinner({
	children,
	isLoading,
	extraSpinnerWrapperClasses = '',
	spinnerSize = 64,
	spinnerWidth = 6,
}) {
	return (
		<>
			{isLoading ? (
				<div
					className={`w-full flex flex-col items-center py-8 ${extraSpinnerWrapperClasses}`}
				>
					<Spinner size={spinnerSize} width={spinnerWidth} />
				</div>
			) : (
				children
			)}
		</>
	);
}
