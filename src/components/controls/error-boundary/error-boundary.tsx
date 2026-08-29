import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
	children: ReactNode;
	className: string;
	onError: ((ex: unknown) => void) | null;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
	static defaultProps = {
		className: '',
		onError: null
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			hasError: false
		};
	}

	static getDerivedStateFromError = (): State => {
		return {
			hasError: true
		};
	};

	componentDidCatch = (ex: Error, info: ErrorInfo) => {
		if (this.props.onError) {
			this.props.onError(ex);
		} else {
			console.error(ex, info.componentStack);
		}
	};

	render = () => {
		if (this.state.hasError) {
			return <div className={`${this.props.className} render-error`.trim()} />;
		}

		return this.props.children;
	};
}
