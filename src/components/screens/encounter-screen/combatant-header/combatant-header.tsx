import { Component } from 'react';

import { CombatantState } from '../../../../enums/combatant-state';
import { CombatantType } from '../../../../enums/combatant-type';

import { GameLogic } from '../../../../logic/game-logic';

import type { CombatantModel } from '../../../../models/combatant';

import { Tabs, Tag, Text, TextType } from '../../../controls';

import { MiniToken } from '../../../panels/encounter-map/mini-token/mini-token';

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
		try {
			const species = GameLogic.getSpecies(this.props.combatant.speciesID);
			const role = GameLogic.getRole(this.props.combatant.roleID);
			const background = GameLogic.getBackground(this.props.combatant.backgroundID);

			return (
				<div className='combatant-header'>
					<div className='header-row'>
						<div className='name'>
							<Text type={TextType.SubHeading}>{this.props.combatant.name}</Text>
							<div className='tags'>
								{species ? <Tag>{species.name}</Tag> : null}
								{role ? <Tag>{role.name}</Tag> : null}
								{background ? <Tag>{background.name}</Tag> : null}
								<Tag>Level {this.props.combatant.level}</Tag>
								{this.props.combatant.quirks.map((q, n) => <Tag key={n}>{q}</Tag>)}
							</div>
						</div>
						<div className='token-container'>
							<MiniToken
								combatant={this.props.combatant}
								encounter={null}
								squareSize={40}
								mapDimensions={{ left: 0, top: 0 }}
								selectable={true}
								selected={false}
								onClick={() => this.props.showCharacterSheet(this.props.combatant)}
								onDoubleClick={() => null}
							/>
						</div>
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
		} catch {
			return <div className='combatant-header render-error' />;
		}
	};
}
