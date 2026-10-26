import { Component, ReactElement, cloneElement } from 'react';

import { CardPreview } from '../card-preview/card-preview';

interface Props {
	// Any of the game's cards. It is rendered twice: in place, with a click that opens it,
	// and again inside the preview - the same element, so the card on show is always the
	// card that was clicked, and a card with a back can still be turned over there.
	card: ReactElement<{ onClick?: unknown }>;
}

interface State {
	showPreview: boolean;
}

// A card that opens for a closer look when it is clicked. Cards are small wherever several
// are shown together, and several of them carry more text than fits at that size, so this
// wraps the ones that are there to be read rather than acted on.
//
// It is deliberately not used for a card whose click already does something - choosing a
// hero, redeeming a reward, playing an action - since taking that click would be a change
// to how the game is played rather than a way to read a card.
export class PreviewableCard extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			showPreview: false
		};
	}

	setShowPreview = (showPreview: boolean) => {
		this.setState({
			showPreview: showPreview
		});
	};

	render = () => {
		return (
			<>
				{cloneElement(this.props.card, { onClick: () => this.setShowPreview(true) })}
				{
					this.state.showPreview ?
						<CardPreview
							card={this.props.card}
							onClose={() => this.setShowPreview(false)}
						/>
						: null
				}
			</>
		);
	};
}
