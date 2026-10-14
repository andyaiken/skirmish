import { Component, MouseEvent, ReactNode, createRef } from 'react';

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

	constructor(props: Props) {
		super(props);
		this.state = {
			scale: 1
		};
	}

	componentDidMount = () => {
		document.addEventListener('keydown', this.onKeyDown);

		const preview = this.previewRef.current;
		if (preview) {
			this.resizeObserver = new ResizeObserver(this.measure);
			this.resizeObserver.observe(preview);
			this.measure();
		}
	};

	componentWillUnmount = () => {
		document.removeEventListener('keydown', this.onKeyDown);
		this.resizeObserver?.disconnect();
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
		return (
			<div className='card-preview-backdrop' onClick={this.closeClick}>
				<div className='card-preview' ref={this.previewRef} role='dialog' aria-modal='true' aria-label='Card preview'>
					<div className='card-preview-content' style={{ zoom: this.state.scale }} onClick={this.cardClick}>
						{this.props.card}
					</div>
				</div>
			</div>
		);
	};
}
