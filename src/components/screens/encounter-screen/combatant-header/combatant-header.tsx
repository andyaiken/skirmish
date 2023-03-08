import { Component } from 'react';
import { IconId } from '@tabler/icons-react';

import { CombatantType } from '../../../../enums/combatant-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { CombatantModel } from '../../../../models/combatant';

import { Selector, Tag, Text, TextType } from '../../../controls';

import './combatant-header.scss';

interface Props {
	combatant: CombatantModel;
	developer: boolean;
	tabID: string;
	onSelectTab: (tabID: string) => void;
	showCharacterSheet: (combatant: CombatantModel) => void;
}

export class CombatantHeader extends Component<Props> {
	render = () => {
		let charSheetBtn = null;
		let selector = null;
		if (this.props.combatant.type === CombatantType.Hero) {
			charSheetBtn = (
				<button className='character-sheet-btn' onClick={() => this.props.showCharacterSheet(this.props.combatant)}>
					<IconId size={40} />
				</button>
			);

			const options = [
				{ id: 'overview', display: 'Overview' },
				{ id: 'move', display: <div>Move</div> }
			];
			if (this.props.developer) {
				options.push({ id: 'action', display: <div>Action</div> });
			}

			selector = (
				<Selector
					options={options}
					selectedID={this.props.tabID}
					onSelect={this.props.onSelectTab}
				/>
			);
		}

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
					{charSheetBtn}
				</div>
				{selector}
			</div>
		);
	};
}
