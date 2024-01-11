import { Component } from 'react';

import { BaseData } from '../../../../data/base-data';

import { FeatureType } from '../../../../enums/feature-type';
import { StructureType } from '../../../../enums/structure-type';

import { CombatantLogic } from '../../../../logic/combatant-logic';
import { FeatureLogic } from '../../../../logic/feature-logic';
import { StrongholdLogic } from '../../../../logic/stronghold-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { FeatureModel } from '../../../../models/feature';
import type { GameModel } from '../../../../models/game';

import { Collections } from '../../../../utils/collections';

import { CardList, IconSize, IconType, IconValue, Text, TextType } from '../../../controls';
import { ChoicePanel } from './choice/choice';
import { FeatureCard } from '../../../cards';

import './level-up.scss';

interface Props {
	combatant: CombatantModel;
	game: GameModel;
	developer: boolean;
	level: number;
	useCharge: (type: StructureType, count: number) => void;
	levelUp: (feature: FeatureModel) => void;
}

interface State {
	features: FeatureModel[];
	selectedFeature: FeatureModel | null;
}

export class LevelUp extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			features: this.drawFeatures(props.combatant),
			selectedFeature: null
		};
	}

	drawFeatures = (combatant: CombatantModel) => {
		let features: FeatureModel[] = [];
		features.push(...CombatantLogic.getFeatureDeck(combatant));
		features.push(...BaseData.getBaseFeatures());

		features = features.filter(feature => {
			// Make sure we can select this feature
			if (feature.type === FeatureType.Proficiency) {
				const profs = CombatantLogic.getProficiencies(combatant);
				if (profs.length >= 9) {
					// We already have all proficiencies
					return false;
				}
				if (profs.includes(feature.proficiency)) {
					// We already have this proficiency
					return false;
				}
			}
			return true;
		});

		return Collections.shuffle(features).splice(0, 3);
	};

	setFeatures = () => {
		this.setState({
			features: this.drawFeatures(this.props.combatant),
			selectedFeature: null
		}, () => {
			if (!this.props.developer) {
				this.props.useCharge(StructureType.TrainingGround, 1);
			}
		});
	};

	setSelectedFeature = (feature: FeatureModel) => {
		this.setState({
			selectedFeature: feature
		}, () => {
			if (!FeatureLogic.hasChoice(this.state.selectedFeature as FeatureModel)) {
				// We can just select this
				this.setState({
					features: this.drawFeatures(this.props.combatant),
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
							<FeatureCard feature={this.state.selectedFeature}
								footer={CombatantLogic.getFeatureSource(this.props.combatant, this.state.selectedFeature.id) || 'Feature'}
								footerType={CombatantLogic.getFeatureSourceType(this.props.combatant, this.state.selectedFeature.id)}
							/>
						</div>
						<div className='level-up-additional'>
							<ChoicePanel feature={this.state.selectedFeature} hero={this.props.combatant} onChange={this.setSelectedFeature} />
						</div>
					</div>
				);
			} else {
				const featureCards = this.state.features.map(feature => {
					return (
						<FeatureCard
							key={feature.id}
							feature={feature}
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
					<Text type={TextType.MinorHeading}>Choose a feature for level {this.props.level}</Text>
					{content}
					{
						(redraws > 0) || this.props.developer ?
							<button className={this.props.developer ? 'developer' : ''} onClick={() => this.setFeatures()}>
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
