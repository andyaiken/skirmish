import { Component } from 'react';
import { EncounterMap } from '../../../models/encounter-map';

import './encounter-map-panel.scss';

interface Props {
	map: EncounterMap;
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
