import { guid } from '../utils/utils';
import { DamageCategory, DamageType } from './damage';
import { FeatureModel } from './feature';

export enum AuraType {
	None = 'None',
	EaseMovement = 'Ease movement',
	PreventMovement = 'Prevent movement',
	AutomaticDamage = 'Automatic damage',
	AutomaticHealing = 'Automatic healing',
	DamageVulnerability = 'Damage vulnerability',
	DamageResistance = 'Damage resistance'
}

export interface AuraModel {
	id: string;
	type: AuraType;
	damage: DamageType;
	damageCategory: DamageCategory;
	rank: number;
}

export const createAura = (feature: FeatureModel) => {
	const aura: AuraModel = {
		id: guid(),
		type: feature.aura,
		damage: feature.damage,
		damageCategory: feature.damageCategory,
		rank: feature.rank
	};
	return aura;
}

export const getAuraDescription = (aura: AuraModel) => {
	switch (aura.type) {
		case AuraType.AutomaticHealing:
		case AuraType.EaseMovement:
		case AuraType.PreventMovement:
			return `${aura.type}`;
		case AuraType.AutomaticDamage:
			return `${aura.type}: ${aura.damage}`;
		case AuraType.DamageResistance:
		case AuraType.DamageVulnerability:
			return `${aura.type}: ${aura.damageCategory}`;
	}

	return '';
}
