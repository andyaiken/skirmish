import { Component } from 'react';

import type { CombatantModel } from '../../../../models/combatant';
import type { OptionsModel } from '../../../../models/options';

import { Expander, Text, TextType } from '../../../controls';
import { CombatantRowPanel } from '../../../panels';

import './finish-page.scss';

interface Props {
	hero: CombatantModel;
	options: OptionsModel;
	rename: () => void;
	recolor: () => void;
	finished: () => void;
}

export class FinishPage extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='finish-page'>
					<div className='finish-page-content'>
						<CombatantRowPanel combatant={this.props.hero} options={this.props.options} />
						{
							this.props.options.showTips ?
								<Expander
									header={
										<Text type={TextType.Tip}>Choose a name and a color for your hero.</Text>
									}
									content={
										<div>
											<p>You can press <b>Change Name</b> to change your hero&apos;s name.</p>
											<p>You can press <b>Change Color</b> to change your hero&apos;s color. This will be used to help identify your hero&apos;s token on the encounter map.</p>
										</div>
									}
								/>
								: null
						}
						<hr />
						<button onClick={this.props.rename}>Change Name</button>
						<button onClick={this.props.recolor}>Change Color</button>
					</div>
					<button className='action primary' onClick={this.props.finished}>Finished</button>
				</div>
			);
		} catch {
			return <div className='finish-page render-error' />;
		}
	};
}
