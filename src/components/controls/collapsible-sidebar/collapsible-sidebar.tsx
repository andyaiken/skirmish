import { Component, ReactNode } from 'react';

import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

import './collapsible-sidebar.scss';

interface Props {
	// Whether the sidebar has to go over the content. When it doesn't, this renders nothing of its
	// own and the sidebar sits where the page puts it, exactly as before.
	collapsible: boolean;

	// What the handle says while the sheet is shut. The page's name for what is in there, or for
	// whatever is selected.
	summary: ReactNode;

	// What the player has selected, if anything. A change to something opens the sheet - they just
	// asked to see it - and a change to nothing shuts it, which is what tapping the content does.
	// The same rule the encounter screen's right-hand panel follows when a round is waiting.
	openFor: string | null;

	children: ReactNode;
}

interface State {
	open: boolean;
}

// A sidebar that goes over the page's content on a screen too narrow to put it beside or below.
//
// Shut, it is a strip along the bottom saying what is behind it; open, it covers the lower part of
// the page and has the whole width to itself, which is what the sections inside it need - laid out
// as a row on a phone they came out at 119px and were clipped. The content keeps its full height
// either way, which on a phone is nearly double what it had.
export class CollapsibleSidebar extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			open: false
		};
	}

	componentDidUpdate = (prev: Props) => {
		if (prev.openFor !== this.props.openFor) {
			this.setState({
				open: this.props.openFor !== null
			});
		}

		// The page has been given room for its sidebar again - a window widened, a device turned -
		// so the sheet is no longer what is being shown, and it should not be open when it next is.
		if (prev.collapsible && !this.props.collapsible && this.state.open) {
			this.setState({
				open: false
			});
		}
	};

	toggle = () => {
		this.setState({
			open: !this.state.open
		});
	};

	render = () => {
		if (!this.props.collapsible) {
			return this.props.children;
		}

		return (
			<div className={`collapsible-sidebar ${this.state.open ? 'open' : 'shut'}`}>
				<button className='sidebar-handle' onClick={this.toggle}>
					<div className='sidebar-handle-text'>{this.props.summary}</div>
					{this.state.open ? <IconChevronDown /> : <IconChevronUp />}
				</button>
				{this.props.children}
			</div>
		);
	};
}
