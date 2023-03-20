import { Component, createRef } from 'react';

import { CombatantModel } from '../../../models/combatant';

import './turn-log.scss';

interface Props {
	combatant: CombatantModel;
}

export class TurnLogPanel extends Component<Props> {

	messagesEndRef = createRef<HTMLDivElement>();

	componentDidMount = () => {
		this.scrollToBottom();
	};

	componentDidUpdate = () => {
		this.scrollToBottom();
	};

	scrollToBottom = () => {
		this.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	render = () => {
		if (this.props.combatant.combat.actionLog.length === 0) {
			return null;
		}

		return (
			<div className='turn-log'>
				{this.props.combatant.combat.actionLog.map((msg, n) => <div key={n} className='turn-log-message'>{msg}</div>)}
				<div ref={this.messagesEndRef} />
			</div>
		);
	};
}
