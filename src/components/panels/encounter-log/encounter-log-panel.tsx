import { Component } from 'react';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { EncounterModel } from '../../../models/encounter';

import { Text, TextType } from '../../controls';

import './encounter-log-panel.scss';

interface Props {
	encounter: EncounterModel;
}

export class EncounterLogPanel extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='encounter-log-panel'>
					<Text type={TextType.SubHeading}>Encounter Log</Text>
					{
						this.props.encounter.log.map(msg =>
							<div key={msg.id} className='encounter-log-item'>
								{EncounterLogic.getLogMessage(msg.message)}
							</div>
						)
					}
					{this.props.encounter.log.length === 0 ? <Text type={TextType.Dimmed}>Nothing to show yet</Text> : null}
				</div>
			);
		} catch {
			return <div className='encounter-log-panel render-error' />;
		}
	};
}
