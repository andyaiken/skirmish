import { Component } from 'react';

import { StructureType } from '../../../../enums/structure-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { FeatureLogic } from '../../../../logic/feature-logic';
import { StrongholdLogic } from '../../../../logic/stronghold-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { FeatureModel } from '../../../../models/feature';
import type { GameModel } from '../../../../models/game';

import { CardList, IconSize, IconType, IconValue, Text, TextType } from '../../../controls';
import { ChoicePanel } from './choice/choice';
import { FeatureCard } from '../../../cards';

import './level-up.scss';

interface Props {
	combatant: CombatantModel;
	game: GameModel;
	developer: boolean;
	level: number;
	features: FeatureModel[];
	useCharge: (type: StructureType, count: number) => void;
	levelUp: (feature: FeatureModel) => void;
	redrawFeatures: (useCharge: boolean) => void;
}

interface State {
	selectedFeature: FeatureModel | null;
}

export class LevelUp extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedFeature: null
		};
	}

	setSelectedFeature = (feature: FeatureModel | null) => {
		this.setState({
			selectedFeature: feature
		}, () => {
			if (feature && !FeatureLogic.hasChoice(feature)) {
				// We can just select this
				this.setState({
					selectedFeature: null
				}, () => {
					this.props.levelUp(feature);
				});
			}
		});
	};

	render = () => {
		try {
			let content = null;
			if (this.state.selectedFeature) {
				content = (
					<div className='feature-detail-selection'>
						<div className='selected-feature'>
							<FeatureCard
								key={this.state.selectedFeature.id}
								feature={this.state.selectedFeature}
								combatant={this.props.combatant}
								footer={CombatantLogic.getFeatureSource(this.props.combatant, this.state.selectedFeature.id) || 'Feature'}
								footerType={CombatantLogic.getFeatureSourceType(this.props.combatant, this.state.selectedFeature.id)}
							/>
						</div>
						<div className='level-up-additional'>
							<ChoicePanel feature={this.state.selectedFeature} hero={this.props.combatant} onSelect={this.setSelectedFeature} />
						</div>
					</div>
				);
			} else {
				const featureCards = this.props.features.map(feature => {
					return (
						<FeatureCard
							key={feature.id}
							feature={feature}
							combatant={this.props.combatant}
							footer={CombatantLogic.getFeatureSource(this.props.combatant, feature.id) || 'Feature'}
							footerType={CombatantLogic.getFeatureSourceType(this.props.combatant, feature.id)}
							onClick={this.setSelectedFeature}
						/>
					);
				});

				content = (
					<CardList cards={featureCards} />
				);
			}

			const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.TrainingGround);

			return (
				<div className='level-up'>
					<Text type={TextType.SubHeading}>Choose a feature for level {this.props.level}</Text>
					{content}
					{
						(redraws > 0) || this.props.developer ?
							<button className={this.props.developer ? 'developer' : ''} onClick={() => this.props.redrawFeatures(!this.props.developer)}>
								Redraw Feature Cards
								<br />
								<IconValue type={IconType.Redraw} value={redraws} size={IconSize.Button} />
							</button>
							: null
					}
				</div>
			);
		} catch {
			return <div className='level-up render-error' />;
		}
	};
}
