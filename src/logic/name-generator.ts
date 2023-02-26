import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

export class NameGenerator {
	static generateName = () => {
		if (Random.randomNumber(10) === 0) {
			return `${NameGenerator.capitalise(NameGenerator.generateWord())} ${NameGenerator.capitalise(NameGenerator.generateWord())}`;
		}

		return NameGenerator.capitalise(NameGenerator.generateWord());
	};

	static generateWord = () => {
		const startHuman1 = 'As Has Khe Zash Gl Ig Iv Kos Miv Pav Ser Dar Even Gor Rand Sto Tam Barer Keth Mum Ford Cam';
		const startHuman2 = 'Mar Burg Al Hel Wrayt S Eag Eath Joan Answ L Ot Ced At Tal Ham Jasm Mail Yash Row';
		const startDwarf = 'Adr Alber Ba Bar Gar Kildr Kath Dies Eld Gurd Har Morg Or Rur Mar Vis Jen Torg Tak Thor End Ris Em Gunn';
		const startElf = 'Ad All Aram Berri Car Enial Gann Im Per Sorvi Var Adr An Beth Bir Jelen Key Lesh Mer Mia Naiv Quel Sar Shan';
		const startHalfling = 'Al An C Cor Eld Er Finn Gar Lin Mer Os Per Ros An Cal Cor Kith Lav Ned Pae Seraph T V Chen';
		const startDragonborn = 'Are Bala Bhar Don Gh Hesk Med Meh Nad Pand Patr Sham Shed Ak Bir Farid Fla Ka Ko Mish Thav Uad Eder Hener';
		const startMisc = 'Alu Stos Fa Ravay Leo Stok Vic El Yeng Car Ric Ar Guir Es My Pey';

		const maleHuman = 'Eir Eid Eed El Ar An Or Ef Al Vin Orn Dur Stag Elm Ur Us For';
		const maleDwarf = 'Ik Ich Ern End Tor Nor In Rak Gen Sik Gran Linn Vok Brek Dal Gar';
		const maleElf = 'An Ar Il Rian Ric Is Dan Arai Meral Cian En Rion Ialis Ior Nan Kas';
		const maleHalfling = 'Ton Der Ade Rin Don Rich Nan Ret Al Born Coe By Fire Yas Dal Yle';
		const maleDragonborn = 'Han Asar Ash Aar Esch An Rash En Arr Jed Rin Gar Ash Dinn Hun Rek';
		const maleMisc = 'Orel Aadi Ahn Aver Eiros Kain Retor Lannan Pet Ikos';

		const femaleHuman = 'Er Ey A E Il Elia Ya Ed Eue Ild Oane Yne Orna Ie Ala Erri Ea Ia';
		const femaleDwarf = 'Ber Tin Hild Dryn A Eth Runn Ellen Loda Dis Ja Lin Ra Tyrd De Rasa';
		const femaleElf = 'Rie Aea Striana Inua Rynna Ilia Na Neth Leth Iel Lee Qui Astra Ia Ania Ynn';
		const femaleHalfling = 'Dry Ree Lie Ora Emia Ian Ri Inia Ina Aena Ani Erna Lyse La Da Aela';
		const femaleDragonborn = 'Ra Ir Eh Ann Ilar Rinn Ann La Ra A Ina Va Hit Ederei Ere Eila';
		const femaleMisc = 'Ina Ceryn Vyn Ella Aella Vyre';

		const starts = [
			startHuman1,
			startHuman2,
			startDwarf,
			startElf,
			startHalfling,
			startDragonborn,
			startMisc
		]
			.join(' ')
			.toLowerCase()
			.split(' ');
		const ends = [
			maleHuman,
			maleDwarf,
			maleElf,
			maleHalfling,
			maleDragonborn,
			maleMisc,
			femaleHuman,
			femaleDwarf,
			femaleElf,
			femaleHalfling,
			femaleDragonborn,
			femaleMisc
		]
			.join(' ')
			.toLowerCase()
			.split(' ');

		let separator = '';
		if (Random.randomNumber(10) === 0) {
			const separators = [ '-', '\'' ];
			separator = Collections.draw(separators);
		}

		const startIndex = Random.randomNumber(starts.length);
		const endIndex = Random.randomNumber(ends.length);
		return starts[startIndex] + separator + ends[endIndex];
	};

	static capitalise = (str: string) => {
		return str
			.split(' ')
			.filter(val => val.length > 0)
			.map(val => {
				const first = val[0].toUpperCase();
				const rest = val.length > 1 ? val.substring(1) : '';
				return first + rest;
			})
			.join(' ');
	};
}
