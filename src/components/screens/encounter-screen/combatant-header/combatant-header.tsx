import { Component } from 'react';
import { IconId } from '@tabler/icons-react';

import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { CombatantModel } from '../../../../models/combatant';

import { Tabs, Tag, Text, TextType } from '../../../controls';

import './combatant-header.scss';

interface Props {
	combatant: CombatantModel;
	developer: boolean;
	tabID: string;
	onSelectTab: (tabID: string) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
}

export class CombatantHeader extends Component<Props> {
	getTabs = () => {
		if (this.props.combatant.type === CombatantType.Monster) {
			return null;
		}

		if ((this.props.combatant.combat.state === CombatantState.Dead) || (this.props.combatant.combat.state === CombatantState.Unconscious)) {
			return null;
		}

		if (this.props.combatant.combat.stunned) {
			return null;
		}

		const options = [
			{ id: 'overview', display: 'Overview' },
			{ id: 'move', display: 'Move' },
			{ id: 'action', display: 'Action' }
		];

		return (
			<Tabs
				options={options}
				selectedID={this.props.tabID}
				onSelect={this.props.onSelectTab}
			/>
		);
	};

	render = () => {
		return (
			<div className='combatant-header'>
				<div className='header-row'>
					<div className='name'>
						<Text type={TextType.SubHeading}>{this.props.combatant.name}</Text>
						<div className='tags'>
							<Tag>{GameLogic.getSpecies(this.props.combatant.speciesID)?.name ?? 'Unknown species'}</Tag>
							<Tag>{GameLogic.getRole(this.props.combatant.roleID)?.name ?? 'Unknown role'}</Tag>
							<Tag>{GameLogic.getBackground(this.props.combatant.backgroundID)?.name ?? 'Unknown background'}</Tag>
							<Tag>Level {this.props.combatant.level}</Tag>
						</div>
					</div>
					<button className='icon-btn character-sheet-btn' onClick={() => this.props.showCharacterSheet(this.props.combatant)}>
						<IconId size={40} />
					</button>
				</div>
				{
					this.props.combatant.combat.state === CombatantState.Prone ?
						<Text type={TextType.Information}><b>{this.props.combatant.name} is Prone.</b> Their skill ranks are halved and moving costs are doubled.</Text>
						: null
				}
				{
					this.props.combatant.combat.hidden > 0 ?
						<Text type={TextType.Information}><b>{this.props.combatant.name} is Hidden.</b> Their moving costs are doubled.</Text>
						: null
				}
				{this.getTabs()}
			</div>
		);
	};
}
