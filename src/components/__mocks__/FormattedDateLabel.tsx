import { FormattedDateLabelProps } from '@/components/FormattedDateLabel';

export default ({ lastUpdatedIso, prefix }: FormattedDateLabelProps) => (
	<p>
		{prefix} {lastUpdatedIso}
	</p>
);
