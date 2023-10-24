import { Component, MouseEvent } from 'react';
import { IconRefresh } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';
import { StructureType } from '../../../enums/structure-type';

import type { StructureModel } from '../../../models/structure';

import { PlayingCard, Text } from '../../controls';

import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './structure-card.scss';

interface Props {
	structure: StructureModel;
	disabled: boolean;
	onClick: ((structure: StructureModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class StructureCard extends Component<Props, State> {
	static defaultProps = {
		disabled: false,
		onClick: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			flipped: false
		};
	}

	onFlip = (e: MouseEvent) => {
		e.stopPropagation();

		this.setState({
			flipped: !this.state.flipped
		});
	};

	onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onClick) {
			this.props.onClick(this.props.structure);
		}
	};

	getStructureDetails = () => {
		switch (this.props.structure.type) {
			case StructureType.Academy:
				return (
					<Text>
						<p>This structure allows you to add bonus XP to your heroes.</p>
						<p>You gain {this.props.structure.level} XP when the structure is charged.</p>
					</Text>
				);
			case StructureType.Barracks:
				return (
					<Text>
						<p>This structure provides living space for up to {this.props.structure.level * 3} heroes.</p>
					</Text>
				);
			case StructureType.Forge:
				return (
					<Text>
						<p>When adding a new structure to your stronghold, this allows you to redraw structure cards.</p>
						<p>You gain {this.props.structure.level} redraw(s) when the structure is charged.</p>
					</Text>
				);
			case StructureType.Hall:
				return (
					<Text>
						<p>When recruiting a new hero, this structure allows you to redraw species, role, or background cards.</p>
						<p>You gain {this.props.structure.level} redraw(s) when the structure is charged.</p>
					</Text>
				);
			case StructureType.Intelligencer:
				return (
					<Text>
						<p>This structure forces monsters to begin an encounter with detrimental conditions.</p>
						<p>You gain {this.props.structure.level} conditions(s) when the structure is charged.</p>
					</Text>
				);
			case StructureType.Observatory:
				return (
					<Text>
						<p>In an encounter, this structure allows you to redraw action cards.</p>
						<p>You gain {this.props.structure.level} redraw(s) when the structure is charged.</p>
					</Text>
				);
			case StructureType.Quartermaster:
				return (
					<Text>
						<p>When recruiting a new hero, this structure allows you to redraw item cards.</p>
						<p>You gain {this.props.structure.level} redraw(s) when the structure is charged.</p>
					</Text>
				);
			case StructureType.Temple:
				return (
					<Text>
						<p>This structure allows your heroes to begin an encounter with beneficial conditions.</p>
						<p>You gain {this.props.structure.level} conditions(s) when the structure is charged.</p>
					</Text>
				);
			case StructureType.ThievesGuild:
				return (
					<Text>
						<p>This structure allows your heroes to take additional actions in an encounter.</p>
						<p>You gain {this.props.structure.level} action(s) when the structure is charged.</p>
					</Text>
				);
			case StructureType.TrainingGround:
				return (
					<Text>
						<p>When levelling-up a hero, this structure allows you to redraw feature cards.</p>
						<p>You gain {this.props.structure.level} redraw(s) when the structure is charged.</p>
					</Text>
				);
			case StructureType.WarRoom:
				return (
					<Text>
						<p>This structure allows you to add additional heroes to an encounter.</p>
						<p>You gain {this.props.structure.level} action(s) when the structure is charged.</p>
					</Text>
				);
			case StructureType.WizardTower:
				return (
					<Text>
						<p>When buying a magic item or potion, this structure allows you to redraw item cards.</p>
						<p>You gain {this.props.structure.level} redraws when the structure is charged.</p>
					</Text>
				);
		}

		return null;
	};

	render = () => {
		const buttons: JSX.Element[] = [];
		buttons.push(
			<button key='flip' className='icon-btn' title='Flip' onClick={this.onFlip}><IconRefresh /></button>
		);

		return (
			<PlayingCard
				type={CardType.Structure}
				front={
					<PlaceholderCard
						text={this.props.structure.name}
						subtext={this.props.structure.description}
					/>
				}
				back={
					<div className='structure-card-back'>
						{this.getStructureDetails()}
					</div>
				}
				footerText='Structure'
				footerContent={buttons}
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}
