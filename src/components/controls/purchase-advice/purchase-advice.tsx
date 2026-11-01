import type { PurchaseAdviceModel } from '../../../logic/thought/purchase-advice';

import { HeroQuote } from '../hero-quote/hero-quote';

import './purchase-advice.scss';

interface Props {
	advice: PurchaseAdviceModel | null;
}

export const PurchaseAdvice = ({ advice }: Props) => advice
	?
	<div className='purchase-advice'>
		<HeroQuote hero={advice.hero} text={advice.message} />
	</div>
	: null;
