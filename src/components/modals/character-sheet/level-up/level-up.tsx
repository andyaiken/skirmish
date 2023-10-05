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

import { FeatureCard, StrongholdBenefitCard } from '../../../cards';
import { ChoicePanel } from './choice/choice';

import './level-up.scss';

interface Props {
	combatant: CombatantModel;
	game: GameModel;
	developer: boolean;
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
			if (this.state.selectedFeature) {
				return (
					<div className='level-up selection-made'>
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
			}

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

			const redraws = StrongholdLogic.getStructureCharges(this.props.game, StructureType.TrainingGround);
			if ((redraws > 0) || this.props.developer) {
				featureCards.push(
					<div key='separator' className='separator' />
				);
				featureCards.push(
					<StrongholdBenefitCard
						key='redraw'
						label='Redraw'
						available={redraws}
						developer={this.props.developer}
						onRedraw={this.setFeatures}
					/>
				);
			}

			return (
				<div className='level-up selecting'>
					{featureCards}
				</div>
			);
		} catch {
			return <div className='level-up render-error' />;
		}
	};
}
