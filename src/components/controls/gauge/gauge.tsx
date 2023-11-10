import './gauge.scss';

interface Props {
	progress: number;
	content: string | JSX.Element | null;
}

export const Gauge = (props: Props) => {
	const width = 92;
	const circumference = 80 * Math.PI;
	const strokeLength = circumference * 2 / 3;

	return (
		<div className='gauge'>
			<svg
				width={width}
				height={width}
				viewBox={`0 0 ${width} ${width}`}
				style={{ transform: 'rotate(-210deg)' }}
			>
				<circle
					cx={width / 2}
					cy={width / 2}
					r={40}
					fill='none'
					stroke='rgb(220, 220, 220)'
					strokeWidth={5}
					strokeDasharray={`${strokeLength}, ${circumference}`}
					strokeLinecap='round'
				/>
				<circle
					cx={width / 2}
					cy={width / 2}
					r={40}
					fill='none'
					stroke='rgb(60, 170, 255)'
					strokeWidth={6}
					strokeDasharray={`${strokeLength}, ${circumference}`}
					strokeDashoffset={strokeLength * (1 - Math.min(props.progress, 1))}
					strokeLinecap='round'
				/>
			</svg>
			<div className='gauge-content'>
				{props.content}
			</div>
		</div>
	);
};
