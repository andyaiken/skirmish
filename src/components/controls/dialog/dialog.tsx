import { Component, ReactNode } from 'react';
import { IconX } from '@tabler/icons-react';

import { ErrorBoundary } from '../error-boundary/error-boundary';

import './dialog.scss';

interface Props {
	content: ReactNode;
	level: number;
	onClose: (() => void) | null;
}

export class Dialog extends Component<Props> {
	static defaultProps = {
		level: 1,
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

	getDialog = () => {
		let closeBtn = null;
		if (this.props.onClose) {
			closeBtn = (
				<button className='icon-btn close-btn' onClick={this.closeClick}>
					<IconX />
				</button>
			);
		}

		return (
			<div className={`dialog level-${this.props.level}`} onClick={this.dialogClick}>
				{closeBtn}
				<div className='dialog-content'>
					<ErrorBoundary className='dialog-content'>
						{this.props.content}
					</ErrorBoundary>
				</div>
			</div>
		);
	};

	render = () => {
		return (
			<div className='dialog-backdrop' onClick={this.closeClick}>
				{this.getDialog()}
			</div>
		);
	};
}
