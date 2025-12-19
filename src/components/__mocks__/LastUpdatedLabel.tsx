import { LastUpdatedLabelProps } from '@/components/LastUpdatedLabel';

export default ({ lastUpdatedIso, prefix }: LastUpdatedLabelProps) => (
	<p>
		{prefix} {lastUpdatedIso}
	</p>
);
