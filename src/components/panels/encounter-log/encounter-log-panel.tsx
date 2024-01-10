import { Component } from 'react';

import { LogPartType } from '../../../enums/log-part-type';

import { EncounterLogic } from '../../../logic/encounter-logic';

import type { EncounterModel, LogMessageModel, LogPartModel } from '../../../models/encounter';

import { Text, TextType } from '../../controls';
import { MiniToken } from '../encounter-map/mini-token/mini-token';

import './encounter-log-panel.scss';

interface Props {
	encounter: EncounterModel;
}

export class EncounterLogPanel extends Component<Props> {
	getPart = (part: LogPartModel, index: number) => {
		switch (part.type) {
			case LogPartType.Combatant: {
				const combatant = EncounterLogic.getCombatant(this.props.encounter, part.data);
				if (combatant) {
					return (
						<span key={index} className='encounter-log-part-combatant'>
							<MiniToken
								combatant={combatant}
								encounter={null}
								squareSize={18}
								mapDimensions={{ left: 0, top: 0 }}
								selectable={true}
								selected={false}
								onClick={() => null}
							/>
							<span className='encounter-log-part-combatant-name'>
								{combatant.name}
							</span>
						</span>
					);
				} else {
					return (
						<span key={index} className='encounter-log-part-combatant'>[unknown combatant]</span>
					);
				}
			}
			case LogPartType.Rank: {
				return <span key={index} className='encounter-log-part-rank'>{part.data}</span>;
			}
			case LogPartType.Result: {
				return <span key={index} className='encounter-log-part-result'>{part.data}</span>;
			}
		}

		return (
			<span key={index} className='encounter-log-part-text'>{part.data}</span>
		);
	};

	getMessage = (msg: LogMessageModel) => {
		return (
			<div key={msg.id} className='encounter-log-item'>
				{msg.parts.map(this.getPart)}
			</div>
		);
	};

	render = () => {
		try {
			return (
				<div className='encounter-log-panel'>
					<Text type={TextType.SubHeading}>Encounter Log</Text>
					{this.props.encounter.log.map(this.getMessage)}
					{this.props.encounter.log.length === 0 ? <Text type={TextType.Dimmed}>Nothing to show yet</Text> : null}
				</div>
			);
		} catch {
			return <div className='encounter-log-panel render-error' />;
		}
	};
}
