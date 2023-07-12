import { Component } from 'react';

import { DamageType } from '../../../../../enums/damage-type';

import { Box, StatValue, Text } from '../../../../controls';

import { Collections } from '../../../../../utils/collections';

import './damage-panel.scss';

interface Props {
	label: string;
	getValue: (type: DamageType) => number;
}

export class DamagePanel extends Component<Props> {
	render = () => {
		const types = [
			DamageType.Acid,
			DamageType.Cold,
			DamageType.Decay,
			DamageType.Edged,
			DamageType.Electricity,
			DamageType.Fire,
			DamageType.Impact,
			DamageType.Light,
			DamageType.Piercing,
			DamageType.Poison,
			DamageType.Psychic,
			DamageType.Sonic
		];

		const values = [ ...types.map(type => ({ type: type, value: this.props.getValue(type) })) ];

		if (values.every(pair => pair.value === 0)) {
			return (
				<Box label={this.props.label}>
					<Text>None</Text>
				</Box>
			);
		}

		if (Collections.min(values, pair => pair.value) === Collections.max(values, pair => pair.value)) {
			return (
				<Box label={this.props.label}>
					<StatValue label='All damage types' value={values[0].value}/>
				</Box>
			);
		}

		const physicalTypes = [ DamageType.Acid, DamageType.Edged, DamageType.Impact, DamageType.Piercing ];
		const physicalValues = [ ...physicalTypes.map(type => ({ type: type, value: this.props.getValue(type) })) ];
		let physical = null;
		if (physicalValues.every(pair => pair.value === 0)) {
			physical = (
				<StatValue label='Physical damage' value={0}/>
			);
		} else if (Collections.min(physicalValues, pair => pair.value) === Collections.max(physicalValues, pair => pair.value)) {
			physical = (
				<StatValue label='Physical damage' value={physicalValues[0].value}/>
			);
		} else {
			physical = (
				<div>
					{physicalTypes.map(type => <StatValue key={type} label={type} value={values.find(p => p.type === type)?.value || 0}/>)}
				</div>
			);
		}

		const energyTypes = [ DamageType.Cold, DamageType.Electricity, DamageType.Fire, DamageType.Light, DamageType.Sonic ];
		const energyValues = [ ...energyTypes.map(type => ({ type: type, value: this.props.getValue(type) })) ];
		let energy = null;
		if (energyValues.every(pair => pair.value === 0)) {
			energy = (
				<StatValue label='Energy damage' value={0}/>
			);
		} else if (Collections.min(energyValues, pair => pair.value) === Collections.max(energyValues, pair => pair.value)) {
			energy = (
				<StatValue label='Energy damage' value={energyValues[0].value}/>
			);
		} else {
			energy = (
				<div>
					{energyTypes.map(type => <StatValue key={type} label={type} value={values.find(p => p.type === type)?.value || 0}/>)}
				</div>
			);
		}

		const corruptionTypes = [ DamageType.Decay, DamageType.Poison, DamageType.Psychic ];
		const corruptionValues = [ ...corruptionTypes.map(type => ({ type: type, value: this.props.getValue(type) })) ];
		let corruption = null;
		if (corruptionValues.every(pair => pair.value === 0)) {
			corruption = (
				<StatValue label='Corruption damage' value={0}/>
			);
		} else if (Collections.min(corruptionValues, pair => pair.value) === Collections.max(corruptionValues, pair => pair.value)) {
			corruption = (
				<StatValue label='Corruption damage' value={corruptionValues[0].value}/>
			);
		} else {
			corruption = (
				<div>
					{corruptionTypes.map(type => <StatValue key={type} label={type} value={values.find(p => p.type === type)?.value || 0}/>)}
				</div>
			);
		}

		return (
			<Box label={this.props.label}>
				{physical}
				<hr />
				{energy}
				<hr />
				{corruption}
			</Box>
		);
	};
}
