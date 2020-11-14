import React from 'react';
import { CampaignMap } from '../models/campaign-map';

interface Props {
	map: CampaignMap;
}

export class CampaignMapPanel extends React.Component<Props> {
	public render() {
		return (
			<div>
				CAMPAIGN MAP PANEL
			</div>
		);
	}
}
