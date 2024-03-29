import { Component, MouseEvent } from 'react';
import { IconCheck, IconCircleArrowDown, IconCircleArrowUp, IconHeartFilled, IconHeartOff, IconId, IconX } from '@tabler/icons-react';

import { CombatantState } from '../../../enums/combatant-state';
import { QuirkType } from '../../../enums/quirk-type';
import { TraitType } from '../../../enums/trait-type';

import { ConditionLogic } from '../../../logic/condition-logic';
import { EncounterLogic } from '../../../logic/encounter-logic';
import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';
import type { OptionsModel } from '../../../models/options';

import { Collections } from '../../../utils/collections';

import { StatValue, Tag, Text, TextType } from '../../controls';
import { MiniToken } from '../encounter-map/mini-token/mini-token';

import './combatant-row-panel.scss';

interface Props {
	mode: 'list' | 'initiative' | 'detailed' | 'header' | 'column';
	combatant: CombatantModel;
	encounter: EncounterModel | null;
	options: OptionsModel;
	onClick: ((combatant: CombatantModel) => void) | null;
	onTokenClick: ((combatant: CombatantModel) => void) | null;
	onSelect: ((combatant: CombatantModel) => void) | null;
	onDetails: ((combatant: CombatantModel) => void) | null;
	onNudgeInitiative: ((combatant: CombatantModel, delta: number) => void) | null;
	onCancel: ((combatant: CombatantModel) => void) | null;
}

export class CombatantRowPanel extends Component<Props> {
	static defaultProps = {
		mode: 'list',
		encounter: null,
		onClick: null,
		onTokenClick: null,
		onSelect: null,
		onDetails: null,
		onNudgeInitiative: null,
		onCancel: null
	};

	onClick = (e: MouseEvent) => {
		e.stopPropagation();
		if (this.props.onClick) {
			this.props.onClick(this.props.combatant);
		}
	};

	onSelect = (e: MouseEvent) => {
		e.stopPropagation();
		if (this.props.onSelect) {
			this.props.onSelect(this.props.combatant);
		}
	};

	onDetails = (e: MouseEvent) => {
		e.stopPropagation();
		if (this.props.onDetails) {
			this.props.onDetails(this.props.combatant);
		}
	};

	onNudgeInitiative = (e: MouseEvent, delta: number) => {
		e.stopPropagation();
		if (this.props.onNudgeInitiative) {
			this.props.onNudgeInitiative(this.props.combatant, delta);
		}
	};

	onCancel = (e: MouseEvent) => {
		e.stopPropagation();
		if (this.props.onCancel) {
			this.props.onCancel(this.props.combatant);
		}
	};

	getListInfo = () => {
		return (
			<div className='info right'>
				{this.getCardTags(true)}
			</div>
		);
	};

	getInitiativeInfo = () => {
		const conditions = Collections.distinct(this.props.combatant.combat.conditions, c => ConditionLogic.getConditionDescription(c))
			.map(c => {
				const set = this.props.combatant.combat.conditions.filter(con => ConditionLogic.getConditionDescription(con) === ConditionLogic.getConditionDescription(c));
				return (
					<StatValue
						key={c.id}
						orientation='compact'
						label={ConditionLogic.getConditionDescription(c)}
						value={Collections.sum(set, c => c.rank)}
					/>
				);
			});

		const showButtons = this.props.options.developer && !this.props.combatant.combat.current && (this.props.combatant.combat.initiative !== Number.MIN_VALUE);

		return (
			<div className='info below'>
				<div className='tags'>
					{this.getCombatTags(true)}
				</div>
				{this.props.combatant.combat.damage > 0 ? this.getDamage() : null}
				{this.getWounds()}
				{this.props.combatant.combat.conditions.length > 0 ? <hr /> : null}
				{conditions}
				{showButtons ? <hr /> : null}
				{
					showButtons ?
						<div className='button-row developer'>
							<button className='icon-btn' onClick={e => this.onNudgeInitiative(e, -1)}><IconCircleArrowDown /></button>
							<StatValue label='Init' value={this.props.combatant.combat.initiative} />
							<button className='icon-btn' onClick={e => this.onNudgeInitiative(e, 1)}><IconCircleArrowUp /></button>
						</div>
						: null
				}
			</div>
		);
	};

	getDetailedInfoBelow = () => {
		return (
			<div className='info below'>
				<div className='tags'>
					{this.getCombatTags(true)}
				</div>
			</div>
		);
	};

	getDetailedInfoEnd = () => {
		return (
			<div className='info end'>
				{this.getDamage()}
				{this.getWounds()}
			</div>
		);
	};

	getHeaderInfoBelow = () => {
		return (
			<div className='info below'>
				<div className='tags'>
					{this.getCardTags(true)}
				</div>
			</div>
		);
	};

	getCardTags = (includeQuirks: boolean) => {
		const species = GameLogic.getSpecies(this.props.combatant.speciesID);
		const role = GameLogic.getRole(this.props.combatant.roleID);
		const background = GameLogic.getBackground(this.props.combatant.backgroundID);

		return [
			species ? <Tag key='species'>{species.name}</Tag> : null,
			role ? <Tag key='role'>{role.name}</Tag> : null,
			background ? <Tag key='background'>{background.name}</Tag> : null,
			<Tag key='level'>Level {this.props.combatant.level}</Tag>,
			...(includeQuirks ? this.props.combatant.quirks.map((q, n) => <Tag key={n}>{q}</Tag>) : [])
		];
	};

	getCombatTags = (includeQuirks: boolean) => {
		return [
			...(includeQuirks ? this.props.combatant.quirks.map((q, n) => <Tag key={n}>{q}</Tag>) : []),
			this.props.combatant.combat.hidden > 0 ? <Tag key='hidden'>Hidden</Tag> : null,
			this.props.combatant.combat.stunned ? <Tag key='stunned'>Stunned</Tag> : null,
			this.props.combatant.combat.state !== CombatantState.Standing ? <Tag key='state'>{this.props.combatant.combat.state}</Tag> : null
		];
	};

	getDamage = () => {
		if (this.props.combatant.quirks.includes(QuirkType.Drone)) {
			return null;
		}

		if (this.props.combatant.combat.state === CombatantState.Dead) {
			return null;
		}

		return (
			<StatValue
				orientation='compact'
				label='Damage'
				value={this.props.combatant.combat.damage}
			/>
		);
	};

	getWounds = () => {
		if (this.props.combatant.quirks.includes(QuirkType.Drone)) {
			return null;
		}

		if (this.props.combatant.combat.state === CombatantState.Unconscious) {
			return null;
		}

		if (this.props.combatant.combat.state === CombatantState.Dead) {
			return null;
		}

		const resolve = this.props.encounter ? EncounterLogic.getTraitRank(this.props.encounter as EncounterModel, this.props.combatant, TraitType.Resolve) : 0;
		const rows = [];
		let hearts = [];
		for (let n = 0; n < resolve; ++n) {
			const wounded = n > resolve - this.props.combatant.combat.wounds - 1;
			hearts.push(wounded ? <IconHeartOff key={n} size={12} /> : <IconHeartFilled key={n} size={12} />);
			if ((hearts.length >= 5) && (this.props.mode !== 'detailed')) {
				rows.push(
					<div key={rows.length} className='hearts-row'>{hearts}</div>
				);
				hearts = [];
			}
		}
		if (hearts.length > 0) {
			rows.push(
				<div key={rows.length} className='hearts-row'>{hearts}</div>
			);
			hearts = [];
		}

		return (
			<StatValue
				orientation='compact'
				label='Wounds'
				value={<div className='hearts'>{rows}</div>}
			/>
		);
	};

	render = () => {
		try {
			const faction = this.props.combatant.quirks.includes(QuirkType.Boss) ? 'boss' : this.props.combatant.faction.toLowerCase();
			const clickable = this.props.onClick !== null ? 'clickable' : '';
			const current = (this.props.mode === 'initiative') && this.props.combatant.combat.current ? 'current' : '';
			const dimmed = (this.props.mode === 'initiative')
				&& (
					(!!this.props.encounter && this.props.encounter.combatants.some(c => c.combat.current) && (this.props.combatant.combat.initiative === Number.MIN_VALUE))
					|| (this.props.combatant.combat.state === CombatantState.Unconscious)
					|| (this.props.combatant.combat.state === CombatantState.Dead)
				) ? 'dimmed' : '';
			const className = `combatant-row-panel ${this.props.mode} ${faction} ${clickable} ${current} ${dimmed}`;

			let infoBelow: JSX.Element | null = null;
			let infoRight: JSX.Element | null = null;
			let infoEnd: JSX.Element | null = null;
			switch (this.props.mode) {
				case 'list':
					infoRight = this.getListInfo();
					break;
				case 'initiative':
					infoBelow = this.getInitiativeInfo();
					break;
				case 'detailed':
					infoBelow = this.getDetailedInfoBelow();
					infoEnd = this.getDetailedInfoEnd();
					break;
				case 'header':
					infoBelow = this.getHeaderInfoBelow();
					break;
			}

			let selectBtn = null;
			if (this.props.onSelect) {
				selectBtn = (
					<button className='icon-btn' onClick={e => this.onSelect(e)}>
						<IconCheck />
					</button>
				);
			}

			let detailsBtn = null;
			if (this.props.onDetails) {
				detailsBtn = (
					<button className='icon-btn' onClick={e => this.onDetails(e)}>
						<IconId />
					</button>
				);
			}

			let cancelBtn = null;
			if (this.props.onCancel) {
				cancelBtn = (
					<button className='icon-btn' onClick={e => this.onCancel(e)}>
						<IconX />
					</button>
				);
			}

			return (
				<div className={className} onClick={e => this.onClick(e)}>
					<MiniToken
						combatant={this.props.combatant}
						encounter={null}
						squareSize={40}
						mapDimensions={{ left: 0, top: 0 }}
						selectable={true}
						selected={false}
						onClick={c => this.props.onTokenClick ? this.props.onTokenClick(c) : null}
					/>
					<div className='name'>
						<Text type={TextType.MinorHeading}>{this.props.combatant.name}</Text>
						{infoBelow}
					</div>
					{infoRight}
					{infoEnd}
					{
						selectBtn || detailsBtn || cancelBtn ?
							<div className='buttons'>
								{selectBtn}
								{detailsBtn}
								{cancelBtn}
							</div>
							: null
					}
				</div>
			);
		} catch {
			return <div className='combatant-row-panel render-error' />;
		}
	};
}
