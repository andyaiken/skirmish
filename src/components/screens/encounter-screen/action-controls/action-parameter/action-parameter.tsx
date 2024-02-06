import { IconArrowsMove, IconCircleMinus, IconCirclePlus, IconDotsCircleHorizontal, IconViewfinder } from '@tabler/icons-react';
import { Component } from 'react';

import { ActionTargetType } from '../../../../../enums/action-target-type';

import { ActionLogic } from '../../../../../logic/action-logic';
import { EncounterLogic } from '../../../../../logic/encounter-logic';

import type { ActionOriginParameterModel, ActionParameterModel, ActionTargetParameterModel, ActionWeaponParameterModel } from '../../../../../models/action';
import type { CombatantModel } from '../../../../../models/combatant';
import type { EncounterModel } from '../../../../../models/encounter';
import type { ItemModel } from '../../../../../models/item';

import { DirectionIndicatorPanel, DirectionPanel } from '../../../../panels';
import { Selector, Tag, Text, TextType } from '../../../../controls';

import './action-parameter.scss';

interface Props {
	parameter: ActionParameterModel;
	encounter: EncounterModel;
	combatant: CombatantModel;
	isSelectedOnMap: boolean;
	selectOnMap: (parameter: ActionParameterModel) => void;
	setWeaponParameterValue: (parameter: ActionWeaponParameterModel, wesponID: string) => void;
	setOriginParameterValue: (parameter: ActionOriginParameterModel, square: { x: number, y: number }) => void;
	setTargetParameterValue: (parameter: ActionTargetParameterModel, targetIDs: string[]) => void;
}

interface State {
	showOriginMoveControl: boolean;
	showTargetSelectControl: boolean;
}

export class ActionParameter extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			showOriginMoveControl: false,
			showTargetSelectControl: false
		};
	}

	toggleOriginMoveControl = () => {
		this.setState({
			showOriginMoveControl: !this.state.showOriginMoveControl,
			showTargetSelectControl: false
		}, () => {
			if (this.props.isSelectedOnMap) {
				this.props.selectOnMap(this.props.parameter);
			}
		});
	};

	toggleTargetSelectControl = () => {
		this.setState({
			showOriginMoveControl: false,
			showTargetSelectControl: !this.state.showTargetSelectControl
		}, () => {
			if (this.props.isSelectedOnMap) {
				this.props.selectOnMap(this.props.parameter);
			}
		});
	};

	toggleSelectedOnMap = () => {
		this.setState({
			showOriginMoveControl: false,
			showTargetSelectControl: false
		}, () => {
			this.props.selectOnMap(this.props.parameter);
		});
	};

	getActionButtons = () => {
		const controls: JSX.Element[] = [];

		switch (this.props.parameter.id) {
			case 'origin': {
				const originParam = this.props.parameter as ActionOriginParameterModel;
				if (originParam.value) {
					const list = originParam.value as { x: number, y: number }[];
					if (list.length > 0) {
						controls.push(
							<button
								key='origin-move'
								className={`icon-btn ${this.state.showOriginMoveControl ? 'checked' : ''}`}
								title='Move Origin Square'
								onClick={this.toggleOriginMoveControl}
							>
								<IconArrowsMove size={15} />
								Move
							</button>
						);
					}
				}
				if (originParam.candidates.length > 1) {
					// There are multiple possible squares
					controls.push(
						<button
							key='origin-select'
							className={`icon-btn ${this.props.isSelectedOnMap ? 'checked' : ''}`}
							title='Select Origin Square'
							onClick={this.toggleSelectedOnMap}
						>
							<IconViewfinder size={15} />
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
							if (targetParam.targets.count === Number.MAX_VALUE) {
								// Targets all possible candidates
							} else {
								// Targets (up to) a specific number of candidates
								if (targetParam.candidates.length > targetParam.targets.count) {
									// There are more possible targets than selected targets
									controls.push(
										<button
											key='combatant-all'
											className={`icon-btn ${this.state.showTargetSelectControl ? 'checked' : ''}`}
											title='List all targets'
											onClick={this.toggleTargetSelectControl}
										>
											<IconDotsCircleHorizontal size={15} />
											List
										</button>
									);
									controls.push(
										<button
											key='combatant-select'
											className={`icon-btn ${this.props.isSelectedOnMap ? 'checked' : ''}`}
											title='Select targets'
											onClick={this.toggleSelectedOnMap}
										>
											<IconViewfinder size={15} />
											Select
										</button>
									);
								}
							}
							break;
						}
						case ActionTargetType.Squares: {
							if (targetParam.targets.count === Number.MAX_VALUE) {
								// Targets all possible candidates
							} else {
								// Targets a specific number of candidates
								if (targetParam.candidates.length > targetParam.targets.count) {
									// There are more possible targets than selected targets
									controls.push(
										<button
											key='square-select'
											className={`icon-btn ${this.props.isSelectedOnMap ? 'checked' : ''}`}
											title='Select Squares'
											onClick={() => this.props.selectOnMap(targetParam)}
										>
											<IconViewfinder size={15} />
											Select
										</button>
									);
								}
							}
							break;
						}
						case ActionTargetType.Walls: {
							if (targetParam.targets.count === Number.MAX_VALUE) {
								// Targets all possible candidates
							} else {
								// Targets a specific number of candidates
								if (targetParam.candidates.length > targetParam.targets.count) {
									// There are more possible targets than selected targets
									controls.push(
										<button
											key='wall-select'
											className={`icon-btn ${this.props.isSelectedOnMap ? 'checked' : ''}`}
											title='Select Walls'
											onClick={() => this.props.selectOnMap(targetParam)}
										>
											<IconViewfinder size={15} />
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
								// Targets (up to) a specific number of candidates
								controls.push(
									...list
										.map(id => EncounterLogic.getCombatant(this.props.encounter, id) as CombatantModel)
										.map(target => {
											if (this.state.showTargetSelectControl) {
												return (
													<Tag key={target.id}>
														<div className='combatant-candidate selected' onClick={() => this.removeCombatant(targetParam, target.id)}>
															{target.name}
															<IconCircleMinus size={15} />
														</div>
													</Tag>
												);
											}
											return (
												<Tag key={target.id}>
													<div className='combatant-candidate'>
														{target.name}
													</div>
												</Tag>
											);
										})
								);
								if (list.length === 0) {
									// There are no (manually-selected) targets
									controls.push(
										<Tag key='target-combatants-number-none'>
											No targets selected
										</Tag>
									);
								}
								if (this.state.showTargetSelectControl) {
									const candidates = targetParam.candidates as string[];
									controls.push(
										...candidates
											.filter(id => !list.includes(id))
											.map(id => EncounterLogic.getCombatant(this.props.encounter, id) as CombatantModel)
											.map(candidate => {
												return (
													<Tag key={candidate.id}>
														<div className='combatant-candidate not-selected' onClick={() => this.addCombatant(targetParam, candidate.id)}>
															{candidate.name}
															<IconCirclePlus size={15} />
														</div>
													</Tag>
												);
											})
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
							onSelect={id => this.props.setWeaponParameterValue(weaponParam, id)}
						/>
					);
				}
				break;
			}
			case 'origin': {
				const originParam = this.props.parameter as ActionOriginParameterModel;
				if (this.props.isSelectedOnMap) {
					controls.push(
						<Text key='origin-select' type={TextType.Information}>
							<p>Select a square on the map.</p>
						</Text>
					);
				}
				if (this.state.showOriginMoveControl) {
					controls.push(this.getMoveControl(originParam));
				}
				break;
			}
			case 'targets': {
				const targetParam = this.props.parameter as ActionTargetParameterModel;
				if (this.props.isSelectedOnMap) {
					if (targetParam.targets) {
						switch (targetParam.targets.type) {
							case ActionTargetType.Combatants:
							case ActionTargetType.Enemies:
							case ActionTargetType.Allies: {
								controls.push(
									<Text key='target-select-combatant' type={TextType.Information}>
										<p>Select your target(s) on the map.</p>
									</Text>
								);
								break;
							}
							case ActionTargetType.Squares: {
								controls.push(
									<Text key='target-select-square' type={TextType.Information}>
										<p>Select your target square(s) on the map.</p>
									</Text>
								);
								break;
							}
							case ActionTargetType.Walls: {
								controls.push(
									<Text key='target-select-wall' type={TextType.Information}>
										<p>Select your target wall(s) on the map.</p>
									</Text>
								);
								break;
							}
						}
					}
				}
				break;
			}
		}

		return controls;
	};

	addCombatant = (parameter: ActionTargetParameterModel, id: string) => {
		let targetIDs = parameter.value as string[];
		targetIDs = targetIDs.filter(item => item !== id);

		if (parameter.targets && (parameter.targets.count === 1)) {
			targetIDs = [];
		}

		targetIDs.push(id);

		this.props.setTargetParameterValue(parameter, targetIDs);
	};

	removeCombatant = (parameter: ActionTargetParameterModel, id: string) => {
		let targetIDs = parameter.value as string[];
		targetIDs = targetIDs.filter(item => item !== id);

		this.props.setTargetParameterValue(parameter, targetIDs);
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

	render = () => {
		try {
			let title = '';
			switch (this.props.parameter.id) {
				case 'weapon':
					title = 'Weapon';
					break;
				case 'origin':
					title = 'Origin';
					break;
				case 'targets':
					title = 'Target(s)';
					break;
			}

			const actions = this.getActionButtons();
			const controls = this.getControls();
			const secondaryControls = this.getSecondaryControls();

			return (
				<div key={this.props.parameter.id} className={ActionLogic.isParameterSet(this.props.parameter) ? 'action-parameter' : 'action-parameter not-set'}>
					<div className='top-line'>
						<Text type={TextType.MinorHeading}>
							{title}
						</Text>
						{actions.length > 0 ? <div className='action-parameter-actions'>{actions}</div> : null}
					</div>
					{controls.length > 0 ? <div className='action-parameter-controls'>{controls}</div> : null}
					{secondaryControls.length > 0 ? <div className='action-parameter-controls secondary'>{secondaryControls}</div> : null}
				</div>
			);
		} catch {
			return <div className='action-parameter render-error' />;
		}
	};
}
