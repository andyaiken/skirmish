import { Component, ReactNode, createRef } from 'react';
import { IconX } from '@tabler/icons-react';

import { ErrorBoundary } from '../error-boundary/error-boundary';
import { Keyboard } from '../../../utils/keyboard/keyboard';

import './dialog.scss';

interface Props {
	content: ReactNode;
	header?: ReactNode;
	footer?: ReactNode;
	className?: string;
	level: number;
	onClose: (() => void) | null;
}

export class Dialog extends Component<Props> {
	static defaultProps = {
		level: 1,
		onClose: null
	};

	dialogRef = createRef<HTMLDivElement>();
	previousFocus: HTMLElement | null = null;

	componentDidMount = () => {
		// Remember what had focus so it can go back there on close, then take focus: without this a
		// keyboard or controller would carry on operating whatever is behind the dialog.
		this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		this.dialogRef.current?.focus({ preventScroll: true });
	};

	componentWillUnmount = () => {
		if (this.previousFocus?.isConnected) {
			this.previousFocus.focus({ preventScroll: true });
		}
	};

	keyDown = (e: React.KeyboardEvent) => {
		// Handled here and stopped, so a dialog open over another closes alone.
		if (e.key === 'Escape') {
			if (this.props.onClose) {
				e.stopPropagation();
				this.props.onClose();
			}
			return;
		}

		Keyboard.trapTab(e, this.dialogRef.current);
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
				<button className='icon-btn close-btn' aria-label='Close' onClick={this.closeClick}>
					<IconX />
				</button>
			);
		}

		// The button is pinned to the dialog's corner rather than put in a row of its own: a row
		// left it marooned above the title with the width beside it empty. Pinned, it stays put
		// while the content scrolls - and the content reserves its corner (see dialog.scss), so
		// the first line of a title flows around it instead of under it.
		return (
			<div
				className={`dialog level-${this.props.level} ${this.props.onClose ? 'closable' : ''} ${this.props.className || ''}`.trim()}
				ref={this.dialogRef}
				role='dialog'
				aria-modal='true'
				tabIndex={-1}
				onClick={this.dialogClick}
			>
				{closeBtn}
				{this.props.header
					? <div className='dialog-header'>
						<ErrorBoundary>
							{this.props.header}
						</ErrorBoundary>
					</div>
					: null}
				<div className='dialog-content'>
					<ErrorBoundary className='dialog-content'>
						{this.props.content}
					</ErrorBoundary>
				</div>
				{this.props.footer
					? <div className='dialog-footer'>
						<ErrorBoundary>
							{this.props.footer}
						</ErrorBoundary>
					</div>
					: null}
			</div>
		);
	};

	render = () => {
		return (
			<div className='dialog-backdrop' onClick={this.closeClick} onKeyDown={this.keyDown}>
				{this.getDialog()}
			</div>
		);
	};
}
