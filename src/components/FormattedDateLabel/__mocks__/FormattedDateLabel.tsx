import { FormattedDateLabelProps } from '@/components/FormattedDateLabel';

export default ({ dateIso, prefix }: FormattedDateLabelProps) => (
	<p>
		{prefix} {dateIso}
	</p>
);
