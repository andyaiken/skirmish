import { IconArrowsMove, IconViewfinder } from '@tabler/icons-react';
import { Component } from 'react';

import { ActionTargetType } from '../../../../../enums/action-target-type';

import { ActionLogic } from '../../../../../logic/action-logic';
import { EncounterLogic } from '../../../../../logic/encounter-logic';

import type { ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel, ActionWeaponParameterModel } from '../../../../../models/action';
import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';
import type { ItemModel } from '../../../../../models/item';

import { Format } from '../../../../../utils/format';

import { DirectionIndicatorPanel, DirectionPanel } from '../../../../panels';
import { Selector, Tag, Text, TextType } from '../../../../controls';

import './action-parameter.scss';

interface Props {
	parameter: ActionParameterModel;
	encounter: EncounterModel;
	combatant: CombatantModel;
	isSelectedOnMap: boolean;
	selectOnMap: (parameter: ActionParameterModel) => void;
	setActionParameterValue: (parameter: ActionParameterModel, value: unknown) => void;
	setOriginParameterValue: (parameter: ActionParameterModel, square: { x: number, y: number }) => void;
}

interface State {
	showMoveControl: boolean;
}

export class ActionParameter extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			showMoveControl: false
		};
	}

	toggleMoveControls = () => {
		this.setState({
			showMoveControl: !this.state.showMoveControl
		}, () => {
			if (this.props.isSelectedOnMap) {
				this.props.selectOnMap(this.props.parameter);
			}
		});
	};

	toggleSelectedOnMap = () => {
		this.setState({
			showMoveControl: false
		}, () => {
			this.props.selectOnMap(this.props.parameter);
		});
	};

	getMoveControl = (param: ActionOriginParameterModel) => {
		const list = param.value as { x: number, y: number }[];
		const square = list[0];
		const candidates = param.candidates as { x: number, y: number }[];

		return (
			<DirectionPanel
				key='dpanel'
				mode='compact'
				movement={0}
				costs={{
					'n': candidates.find(s => (s.x === square.x) && (s.y === square.y - 1)) ? 0 : Number.MAX_VALUE,
					'ne': candidates.find(s => (s.x === square.x + 1) && (s.y === square.y - 1)) ? 0 : Number.MAX_VALUE,
					'e': candidates.find(s => (s.x === square.x + 1) && (s.y === square.y)) ? 0 : Number.MAX_VALUE,
					'se': candidates.find(s => (s.x === square.x + 1) && (s.y === square.y + 1)) ? 0 : Number.MAX_VALUE,
					's': candidates.find(s => (s.x === square.x) && (s.y === square.y + 1)) ? 0 : Number.MAX_VALUE,
					'sw': candidates.find(s => (s.x === square.x - 1) && (s.y === square.y + 1)) ? 0 : Number.MAX_VALUE,
					'w': candidates.find(s => (s.x === square.x - 1) && (s.y === square.y)) ? 0 : Number.MAX_VALUE,
					'nw': candidates.find(s => (s.x === square.x - 1) && (s.y === square.y - 1)) ? 0 : Number.MAX_VALUE
				}}
				onMove={(dir, cost) => {
					const sq = { x: square.x, y: square.y };
					switch (dir) {
						case 'n':
							sq.y -= 1;
							break;
						case 'ne':
							sq.x += 1;
							sq.y -= 1;
							break;
						case 'e':
							sq.x += 1;
							break;
						case 'se':
							sq.x += 1;
							sq.y += 1;
							break;
						case 's':
							sq.y += 1;
							break;
						case 'sw':
							sq.x -= 1;
							sq.y += 1;
							break;
						case 'w':
							sq.x -= 1;
							break;
						case 'nw':
							sq.x -= 1;
							sq.y -= 1;
							break;
					}
					this.props.setOriginParameterValue(param, sq);
				}}
			/>
		);
	};

	getControls = () => {
		const controls: JSX.Element[] = [];

		switch (this.props.parameter.id) {
			case 'weapon': {
				const weaponParam = this.props.parameter as ActionWeaponParameterModel;
				if (weaponParam.value) {
					// A weapon is selected
				} else {
					controls.push(
						<Tag key='weapon-none'>
							No suitable weapon equipped
						</Tag>
					);
				}
				break;
			}
			case 'origin': {
				const originParam = this.props.parameter as ActionOriginParameterModel;
				if (originParam.value) {
					const list = originParam.value as { x: number, y: number }[];
					if (list.length > 0) {
						const square = list[0];
						controls.push(
							<DirectionIndicatorPanel
								key={`${square.x} ${square.y}`}
								from={EncounterLogic.getCombatantSquares(this.props.encounter, this.props.combatant)}
								to={[ square ]}
							/>
						);
						controls.push(
							<button
								key='move'
								className={`icon-btn ${this.state.showMoveControl ? 'checked' : ''}`}
								title='Move Origin Square'
								onClick={this.toggleMoveControls}
							>
								<IconArrowsMove />
								Move
							</button>
						);
					} else {
						// The value list is empty
						controls.push(
							<Tag key='origin-none-empty'>
								Not set
							</Tag>
						);
					}
				} else {
					// The value list is null
					controls.push(
						<Tag key='origin-none-null'>
							Not set
						</Tag>
					);
				}
				if (originParam.candidates.length > 1) {
					// There are multiple possible squares
					controls.push(
						<button
							key='change'
							className={`icon-btn ${this.props.isSelectedOnMap ? 'checked' : ''}`}
							title='Select Origin Square'
							onClick={this.toggleSelectedOnMap}
						>
							<IconViewfinder />
							Select
						</button>
					);
				}
				break;
			}
			case 'targets': {
				const targetParam = this.props.parameter as ActionTargetParameterModel;
				if (targetParam.targets) {
					switch (targetParam.targets.type) {
						case ActionTargetType.Combatants:
						case ActionTargetType.Enemies:
						case ActionTargetType.Allies: {
							const list = targetParam.value as string[];
							if (targetParam.targets.count === Number.MAX_VALUE) {
								// Targets all possible candidates
								controls.push(
									...list
										.map(id => EncounterLogic.getCombatant(this.props.encounter, id) as CombatantModel)
										.map(target => <Tag key={target.id}>{target.name}</Tag>)
								);
								if (list.length === 0) {
									// There are no (auto-selected) targets
									controls.push(
										<Tag key='target-combatants-all-none'>
											No suitable targets within range
										</Tag>
									);
								}
							} else {
								// Targets a specific number of candidates
								controls.push(
									...list
										.map(id => EncounterLogic.getCombatant(this.props.encounter, id) as CombatantModel)
										.map(target => <Tag key={target.id}>{target.name}</Tag>)
								);
								if (list.length === 0) {
									// There are no (manually-selected) targets
									controls.push(
										<Tag key='target-combatants-number-none'>
											No targets selected
										</Tag>
									);
								}
								if (targetParam.candidates.length > targetParam.targets.count) {
									// There are more possible targets than selected targets
									controls.push(
										<button
											key='change'
											className={`icon-btn ${this.props.isSelectedOnMap ? 'checked' : ''}`}
											title={`Select ${targetParam.targets.type.toLowerCase()}`}
											onClick={this.toggleSelectedOnMap}
										>
											<IconViewfinder />
											Select
										</button>
									);
								}
							}
							break;
						}
						case ActionTargetType.Squares: {
							const list = targetParam.value as { x: number, y: number }[];
							if (targetParam.targets.count === Number.MAX_VALUE) {
								// Targets all possible candidates
								controls.push(
									<Tag key='target-squares'>
										{list.length > 0 ? `${list.length} squares` : 'No squares selected'}
									</Tag>
								);
							} else {
								// Targets a specific number of candidates
								controls.push(
									...list.map(square => {
										return (
											<DirectionIndicatorPanel
												key={`${square.x} ${square.y}`}
												from={EncounterLogic.getCombatantSquares(this.props.encounter, this.props.combatant)}
												to={[ square ]}
											/>
										);
									})
								);
								if (targetParam.candidates.length > targetParam.targets.count) {
									// There are more possible targets than selected targets
									controls.push(
										<button
											key='change'
											className={`icon-btn ${this.props.isSelectedOnMap ? 'checked' : ''}`}
											title='Select Squares'
											onClick={() => this.props.selectOnMap(targetParam)}
										>
											<IconViewfinder />
											Select
										</button>
									);
								}
							}
							break;
						}
						case ActionTargetType.Walls: {
							const list = targetParam.value as { x: number, y: number }[];
							if (targetParam.targets.count === Number.MAX_VALUE) {
								// Targets all possible candidates
								controls.push(
									<Tag key='target-walls'>
										{list.length > 0 ? `${list.length} walls` : 'No walls selected'}
									</Tag>
								);
							} else {
								// Targets a specific number of candidates
								controls.push(
									...list.map(square => {
										return (
											<DirectionIndicatorPanel
												key={`${square.x} ${square.y}`}
												from={EncounterLogic.getCombatantSquares(this.props.encounter, this.props.combatant)}
												to={[ square ]}
											/>
										);
									})
								);
								if (targetParam.candidates.length > targetParam.targets.count) {
									// There are more possible targets than selected targets
									controls.push(
										<button
											key='change'
											className={`icon-btn ${this.props.isSelectedOnMap ? 'checked' : ''}`}
											title='Select Walls'
											onClick={() => this.props.selectOnMap(targetParam)}
										>
											<IconViewfinder />
											Select
										</button>
									);
								}
							}
							break;
						}
					}
				}
				break;
			}
		}

		return controls;
	};

	getSecondaryControls = () => {
		const controls: JSX.Element[] = [];

		switch (this.props.parameter.id) {
			case 'weapon': {
				const weaponParam = this.props.parameter as ActionWeaponParameterModel;
				if (weaponParam.candidates.length > 1) {
					controls.push(
						<Selector
							key='weapon-select'
							options={
								weaponParam.candidates
									.map(candidate => candidate as string)
									.map(id => this.props.combatant.items.find(i => i.id === id) as ItemModel)
									.map(item => ({ id: item.id, display: item.name }))
							}
							selectedID={weaponParam.value as string}
							onSelect={id => this.props.setActionParameterValue(this.props.parameter, id)}
						/>
					);
				}
				break;
			}
			case 'origin': {
				const originParam = this.props.parameter as ActionOriginParameterModel;
				if (originParam.candidates.length > 1) {
					if (this.props.isSelectedOnMap) {
						controls.push(
							<Text key='origin-select' type={TextType.Information}>
								<p>Select a square on the map, then press the <b>Select</b> button again to confirm your selection.</p>
							</Text>
						);
					}
				}
				if (this.state.showMoveControl) {
					controls.push(this.getMoveControl(originParam));
				}
				break;
			}
			case 'targets': {
				const targetParam = this.props.parameter as ActionTargetParameterModel;
				if (targetParam.targets) {
					if (targetParam.targets.count !== Number.MAX_VALUE) {
						if (targetParam.candidates.length > targetParam.targets.count) {
							if (this.props.isSelectedOnMap) {
								switch (targetParam.targets.type) {
									case ActionTargetType.Combatants:
									case ActionTargetType.Enemies:
									case ActionTargetType.Allies: {
										controls.push(
											<Text key='target-select-combatant' type={TextType.Information}>
												<p>Select targets on the map, then press the <b>Select</b> button again to confirm your selection.</p>
											</Text>
										);
										break;
									}
									case ActionTargetType.Squares: {
										controls.push(
											<Text key='target-select-square' type={TextType.Information}>
												<p>Select squares on the map, then press the <b>Select</b> button again to confirm your selection.</p>
											</Text>
										);
										break;
									}
									case ActionTargetType.Walls: {
										controls.push(
											<Text key='target-select-wall' type={TextType.Information}>
												<p>Select walls on the map, then press the <b>Select</b> button again to confirm your selection.</p>
											</Text>
										);
										break;
									}
								}
							}
						}
					}
				}
				break;
			}
		}

		return controls;
	};

	render = () => {
		try {
			const controls = this.getControls();
			const secondaryControls = this.getSecondaryControls();

			return (
				<div key={this.props.parameter.id} className={ActionLogic.isParameterSet(this.props.parameter) ? 'action-parameter' : 'action-parameter not-set'}>
					<Text type={TextType.MinorHeading}>
						{Format.capitalize(this.props.parameter.id)}
					</Text>
					{controls.length > 0 ? <div className='action-parameter-controls'>{controls}</div> : null}
					{secondaryControls.length > 0 ? <div className='action-parameter-controls secondary'>{secondaryControls}</div> : null}
				</div>
			);
		} catch {
			return <div className='action-parameter render-error' />;
		}
	};
}
