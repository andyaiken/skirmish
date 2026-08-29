import { ReactNode } from 'react';

import './box.scss';

interface Props {
	label: string;
	children: ReactNode;
}

export const Box = (props: Props) => {
	return (
		<div className='box'>
			<div className='box-content'>
				{props.children}
			</div>
			<div className='box-label'>
				{props.label}
			</div>
		</div>
	);
};
