import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

interface Props {
	children: ReactNode;
}

// Shrinks its content, never enlarging it, so that it fits inside whatever space it's given
export const ScaleToFit = (props: Props) => {
	const [ scale, setScale ] = useState<number>(1);

	const outerRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const outer = outerRef.current;
		const inner = innerRef.current;
		if (!outer || !inner) {
			return;
		}

		// offsetWidth and offsetHeight ignore the transform, so this measures the content's natural size
		const measure = () => {
			if ((inner.offsetWidth === 0) || (inner.offsetHeight === 0)) {
				return;
			}

			setScale(Math.min(1, outer.clientWidth / inner.offsetWidth, outer.clientHeight / inner.offsetHeight));
		};

		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(outer);
		observer.observe(inner);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div className='scale-to-fit' ref={outerRef}>
			<div className='scale-to-fit-content' ref={innerRef} style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
				{props.children}
			</div>
		</div>
	);
};
