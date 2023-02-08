import { Component } from 'react';
import { EncounterMapModel } from '../../../models/encounter-map';

import './encounter-map-panel.scss';

interface Props {
	map: EncounterMapModel;
}

export class EncounterMapPanel extends Component<Props> {
	public render() {
		return (
			<div className='encounter-map-panel'>
				ENCOUNTER MAP PANEL
			</div>
		);
	}
}
