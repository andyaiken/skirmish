import React from 'react';
import { EncounterMap } from '../../models/encounter-map';

interface Props {
	map: EncounterMap;
}

export class EncounterMapPanel extends React.Component<Props> {
	public render() {
		return (
			<div>
				ENCOUNTER MAP PANEL
			</div>
		);
	}
}
