import { Component } from 'react';

import { EncounterState } from '../../../../enums/encounter-state';

import { EncounterLogic } from '../../../../logic/encounter-logic';

import type { EncounterModel } from '../../../../models/encounter';
import type { GameModel } from '../../../../models/game';
import type { OptionsModel } from '../../../../models/options';
import type { RegionModel } from '../../../../models/region';

import { Text, TextType } from '../../../controls';
import { BoonCard } from '../../../cards';

import './encounter-controls.scss';

interface EncounterControlsProps {
	encounter: EncounterModel;
	game: GameModel;
	options: OptionsModel;
	state: EncounterState;
	setEncounterState: (state: EncounterState) => void;
	finishEncounter: (state: EncounterState) => void;
}

export class EncounterControls extends Component<EncounterControlsProps> {
	render = () => {
		try {
			const region = this.props.game.map.regions.find(r => r.id === this.props.encounter.regionID) as RegionModel;

			switch (this.props.state) {
				case EncounterState.Victory:
					if (region.encounters.length > 1) {
						return (
							<div className='encounter-controls'>
								<Text type={TextType.Heading}>Victory</Text>
								<Text type={TextType.MinorHeading}>You won the encounter in {region.name}!</Text>
								<hr />
								<ul>
									<li>Each surviving hero who took part in this encounter gains 1 XP.</li>
									<li>Any heroes who died have been lost.</li>
								</ul>
								<hr />
								<button className='primary' onClick={() => this.props.finishEncounter(EncounterState.Victory)}>OK</button>
								{
									this.props.state !== EncounterLogic.getEncounterState(this.props.encounter) ?
										<button onClick={() => this.props.setEncounterState(EncounterState.Active)}>Cancel</button>
										: null
								}
							</div>
						);
					} else {
						return (
							<div className='encounter-controls'>
								<Text type={TextType.Heading}>Victory</Text>
								<Text type={TextType.MinorHeading}>You have taken control of {region.name}!</Text>
								<hr />
								<ul>
									<li>Each surviving hero who took part in this encounter gains 1 XP.</li>
									<li>Any heroes who died have been lost.</li>
									<li>You can recruit a new hero.</li>
									<li>You have earned a reward.</li>
								</ul>
								<div className='region-reward'>
									<BoonCard boon={region.boon} />
								</div>
								<hr />
								<button className='primary' onClick={() => this.props.finishEncounter(EncounterState.Victory)}>OK</button>
								{
									this.props.state !== EncounterLogic.getEncounterState(this.props.encounter) ?
										<button onClick={() => this.props.setEncounterState(EncounterState.Active)}>Cancel</button>
										: null
								}
							</div>
						);
					}
				case EncounterState.Defeat:
					return (
						<div className='encounter-controls'>
							<Text type={TextType.Heading}>Defeated</Text>
							<Text type={TextType.MinorHeading}>You lost the encounter in {region.name}.</Text>
							<hr />
							<ul>
								<li>Those heroes who took part have been lost, along with all their equipment.</li>
							</ul>
							<hr />
							<button className='primary' onClick={() => this.props.finishEncounter(EncounterState.Defeat)}>OK</button>
							{
								this.props.state !== EncounterLogic.getEncounterState(this.props.encounter) ?
									<button onClick={() => this.props.setEncounterState(EncounterState.Active)}>Cancel</button>
									: null
							}
						</div>
					);
				case EncounterState.Retreat:
					return (
						<div className='encounter-controls'>
							<Text type={TextType.Heading}>Retreat</Text>
							<Text type={TextType.MinorHeading}>You retreated from the encounter in {region.name}.</Text>
							<hr />
							<ul>
								<li>Any heroes who fell have been lost, along with all their equipment.</li>
							</ul>
							<hr />
							<button className='primary' onClick={() => this.props.finishEncounter(EncounterState.Retreat)}>OK</button>
							{
								this.props.state !== EncounterLogic.getEncounterState(this.props.encounter) ?
									<button onClick={() => this.props.setEncounterState(EncounterState.Active)}>Cancel</button>
									: null
							}
						</div>
					);
			}

			return null;
		} catch {
			return <div className='encounter-controls render-error' />;
		}
	};
}
