import { Component, MouseEvent, ReactNode, createRef } from 'react';
import { createPortal } from 'react-dom';

import { Keyboard } from '../../../utils/keyboard/keyboard';

import './card-preview.scss';

interface Props {
	card: ReactNode;
	onClose: () => void;
}

interface State {
	scale: number;
}

export class CardPreview extends Component<Props, State> {
	private previewRef = createRef<HTMLDivElement>();
	private resizeObserver: ResizeObserver | null = null;
	private previousFocus: HTMLElement | null = null;

	constructor(props: Props) {
		super(props);
		this.state = {
			scale: 1
		};
	}

	componentDidMount = () => {
		// Captured, and stopped, so that Escape closes only the preview: it is often open over a dialog,
		// which would otherwise close too.
		document.addEventListener('keydown', this.onKeyDown, true);

		// Takes focus, and gives it back on close, as a dialog does: the preview is portalled out
		// of any dialog it was opened from, so that dialog's hold on Tab would otherwise keep focus
		// behind it, where the card's own controls (Flip) cannot be reached.
		this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		this.previewRef.current?.focus({ preventScroll: true });

		const preview = this.previewRef.current;
		if (preview) {
			this.resizeObserver = new ResizeObserver(this.measure);
			this.resizeObserver.observe(preview);
			this.measure();
		}
	};

	componentWillUnmount = () => {
		document.removeEventListener('keydown', this.onKeyDown, true);
		this.resizeObserver?.disconnect();

		if (this.previousFocus?.isConnected) {
			this.previousFocus.focus({ preventScroll: true });
		}
	};

	measure = () => {
		const preview = this.previewRef.current;
		if (!preview) {
			return;
		}

		const availableWidth = preview.clientWidth - 50;
		const availableHeight = preview.clientHeight - 50;
		const scale = Math.max(0, Math.min(availableWidth / 200, availableHeight / 300));
		this.setState({ scale });
	};

	onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.stopPropagation();
			this.props.onClose();
		}
	};

	closeClick = () => {
		this.props.onClose();
	};

	cardClick = (e: MouseEvent) => {
		e.stopPropagation();
	};

	render = () => {
		// Portalled out of wherever the card sits: inside a scrolling sheet (the campaign sidebar on a
		// phone) a fixed element is clipped to and positioned against that sheet, not the screen.
		const root = document.querySelector('.skirmish') ?? document.body;
		return createPortal(
			<div className='card-preview-backdrop' onClick={this.closeClick}>
				<div
					className='card-preview'
					ref={this.previewRef}
					role='dialog'
					aria-modal='true'
					aria-label='Card preview'
					tabIndex={-1}
					onKeyDown={e => Keyboard.trapTab(e, this.previewRef.current)}
				>
					<div className='card-preview-content' style={{ zoom: this.state.scale }} onClick={this.cardClick}>
						{this.props.card}
					</div>
				</div>
			</div>,
			root
		);
	};
}
