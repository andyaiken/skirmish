import { ReactNode } from 'react';

import './tag.scss';

interface Props {
	children: ReactNode;
}

export const Tag = (props: Props) => {
	return (
		<div className='tag'>
			{props.children}
		</div>
	);
};
