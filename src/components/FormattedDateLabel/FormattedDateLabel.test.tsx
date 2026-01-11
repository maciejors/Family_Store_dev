import { render, screen } from '@testing-library/react';
import FormattedDateLabel, { FormattedDateLabelProps } from './FormattedDateLabel';

test('Should display the prefix', async () => {
	const props: FormattedDateLabelProps = {
		prefix: 'Updated on: ',
		dateIso: '2020-04-01T10:00:00',
	};
	render(<FormattedDateLabel {...props} />);

	expect(await screen.findByText(new RegExp(props.prefix))).toBeInTheDocument();
});
