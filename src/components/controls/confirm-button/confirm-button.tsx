import { useState } from 'react';

import { Text } from '../../controls';

import './confirm-button.scss';

interface Props {
	label: string;
	onClick: () => void;
}

export const ConfirmButton = (props: Props) => {
	const [ view, setView ] = useState<'button' | 'query'>('button');

	const showDialog = () => {
		setView('query');
	};

	const onConfirm = () => {
		setView('button');
		props.onClick();
	};

	const onCancel = () => {
		setView('button');
	};

	if (view === 'button') {
		return (
			<button className='danger' onClick={showDialog}>{props.label}</button>
		);
	}

	try {
		return (
			<div className='confirm-query'>
				<Text>
					<b>{`${props.label} - are you sure?`}</b>
				</Text>
				<div className='button-row'>
					<button onClick={onConfirm}>OK</button>
					<button onClick={onCancel}>Cancel</button>
				</div>
			</div>
		);
	} catch {
		return <div className='confirm-query render-error' />;
	}
};
