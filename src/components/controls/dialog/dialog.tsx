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

		// The button is pinned to the dialog's corner rather than put in a row of its own: a row
		// left it marooned above the title with the width beside it empty. Pinned, it stays put
		// while the content scrolls - and the content reserves its corner (see dialog.scss), so
		// the first line of a title flows around it instead of under it.
		return (
			<div className={`dialog level-${this.props.level} ${this.props.onClose ? 'closable' : ''}`} onClick={this.dialogClick}>
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
