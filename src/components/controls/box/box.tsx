import './box.scss';

interface Props {
	label: string;
	children: JSX.Element | null | (JSX.Element | null)[];
}

export const Box = (props: Props) => {
	try {
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
	} catch {
		return <div className='box render-error' />;
	}
};
