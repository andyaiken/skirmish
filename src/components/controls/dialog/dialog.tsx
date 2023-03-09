import { Component } from 'react';
import { IconX } from '@tabler/icons-react';

import './dialog.scss';

interface Props {
	content: JSX.Element;
	onClose: (() => void) | null;
}

export class Dialog extends Component<Props> {
	static defaultProps = {
		onClose: null
	};

	closeClick = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (this.props.onClose) {
			this.props.onClose();
		}
	};

	dialogClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	render = () => {
		let closeBtn = null;
		if (this.props.onClose) {
			closeBtn = (
				<button className='icon-btn close-btn' onClick={this.closeClick}>
					<IconX />
				</button>
			);
		}

		return (
			<div className='dialog-backdrop' onClick={this.closeClick}>
				<div className='dialog' onClick={this.dialogClick}>
					{closeBtn}
					<div className='dialog-content'>
						{this.props.content}
					</div>
				</div>
			</div>
		);
	};
}
