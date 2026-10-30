import { Component, ReactNode, createRef } from 'react';
import { IconArrowsRightLeft, IconMoonStars, IconUser, IconUserDown, IconX } from '@tabler/icons-react';

import { CombatantState } from '../../../enums/combatant-state';

import type { CombatantModel } from '../../../models/combatant';

import './combatant-state-panel.scss';

interface Props {
	combatant: CombatantModel;
}

interface State {
	showLabels: boolean;
}

export class CombatantStatePanel extends Component<Props, State> {
	// What the row comes to with the labels in: three boxes at the 50 their flex basis gives them,
	// one at the 52 'Standing' takes at 11px, the three arrows between them, and the panel's own
	// padding and border either side. Below this the labels have nowhere to go, and since the row
	// cannot wrap the panel simply ran off its own right-hand edge - at 320pt it needed 235 of the
	// 190 it had, and the 'Dead' box was cut in half by the sheet clipping it.
	private static widthForLabels = 52 + (50 * 3) + (10 * 3) + (3 * 2) + (1 * 2);

	// Measured of the panel rather than of the screen, because the panel's width is not the
	// screen's: it sits in a column beside the map on a tablet and in a sheet over it on a phone.
	// The same question every other size in the app asks - how much room is there - asked of the
	// one box whose room decides this. CardPreview measures itself the same way.
	private panelRef = createRef<HTMLDivElement>();
	private resizeObserver: ResizeObserver | null = null;

	constructor(props: Props) {
		super(props);
		this.state = {
			showLabels: true
		};
	}

	componentDidMount = () => {
		const panel = this.panelRef.current;
		if (panel) {
			this.resizeObserver = new ResizeObserver(this.measure);
			this.resizeObserver.observe(panel);
			this.measure();
		}
	};

	componentWillUnmount = () => {
		this.resizeObserver?.disconnect();
	};

	measure = () => {
		const panel = this.panelRef.current;
		if (!panel) {
			return;
		}

		// The panel is as wide as whatever holds it, so this does not change when the labels go -
		// there is no loop here where hiding them makes room to show them again.
		const showLabels = panel.getBoundingClientRect().width >= CombatantStatePanel.widthForLabels;
		if (showLabels !== this.state.showLabels) {
			this.setState({ showLabels: showLabels });
		}
	};

	getStateBox = (state: CombatantState, icon: ReactNode, label: string) => {
		const selected = this.props.combatant.combat.state === state;
		return (
			// The label is the only thing naming the icon, so when it goes the name stays here.
			<div className={selected ? 'state-box selected' : 'state-box'} title={label}>
				{icon}
				{this.state.showLabels ? <div className='state-text'>{label}</div> : null}
			</div>
		);
	};

	render = () => {
		return (
			<div ref={this.panelRef} className={this.state.showLabels ? 'combatant-state-panel' : 'combatant-state-panel icons-only'}>
				{this.getStateBox(CombatantState.Standing, <IconUser />, 'Standing')}
				<IconArrowsRightLeft className='state-arrows' size={10} />
				{this.getStateBox(CombatantState.Prone, <IconUserDown />, 'Prone')}
				<IconArrowsRightLeft className='state-arrows' size={10} />
				{this.getStateBox(CombatantState.Unconscious, <IconMoonStars />, 'Unc.')}
				<IconArrowsRightLeft className='state-arrows' size={10} />
				{this.getStateBox(CombatantState.Dead, <IconX />, 'Dead')}
				{this.props.combatant.combat.stunned ? <div className='state-stunned'>Stunned</div> : null}
			</div>
		);
	};
}
