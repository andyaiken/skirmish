import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

export class NameGenerator {
	static generateName = () => {
		let count = 1;
		switch (Random.randomNumber(20)) {
			case 15:
			case 16:
			case 17:
			case 18:
				count = 2;
				break;
			case 19:
				count = 3;
				break;
		}

		const names = [];
		while (names.length < count) {
			names.push(NameGenerator.capitalise(NameGenerator.generateWord()));
		}

		return names.join(' ');
	};

	static generateWord = () => {
		const starts = [
			'ad',
			'adr',
			'ak',
			'al',
			'alber',
			'all',
			'alu',
			'an',
			'answ',
			'ar',
			'aram',
			'are',
			'as',
			'at',
			'ba',
			'bala',
			'bar',
			'barer',
			'berri',
			'beth',
			'bhar',
			'bir',
			'burg',
			'c',
			'cal',
			'cam',
			'car',
			'ced',
			'chen',
			'cor',
			'dar',
			'dies',
			'don',
			'eag',
			'eath',
			'eder',
			'el',
			'eld',
			'em',
			'end',
			'enial',
			'er',
			'es',
			'even',
			'fa',
			'farid',
			'finn',
			'fitz',
			'fla',
			'ford',
			'gann',
			'gar',
			'gh',
			'gl',
			'gor',
			'guir',
			'gunn',
			'gurd',
			'ham',
			'har',
			'has',
			'hel',
			'hener',
			'hesk',
			'ig',
			'im',
			'iv',
			'jasm',
			'jelen',
			'jen',
			'joan',
			'ka',
			'kath',
			'keth',
			'key',
			'khe',
			'kildr',
			'kith',
			'ko',
			'kos',
			'l',
			'lav',
			'leo',
			'lesh',
			'lin',
			'mac',
			'mail',
			'mar',
			'med',
			'meh',
			'mer',
			'mia',
			'mish',
			'miv',
			'morg',
			'mum',
			'my',
			'nad',
			'naiv',
			'ned',
			'or',
			'os',
			'ot',
			'pae',
			'pand',
			'patr',
			'pav',
			'pen',
			'per',
			'pey',
			'pol',
			'quel',
			'rand',
			'ravay',
			'ric',
			'ris',
			'ros',
			'row',
			'rur',
			's',
			'sar',
			'ser',
			'seraph',
			'sham',
			'shan',
			'shed',
			'sorvi',
			'sto',
			'stok',
			'stos',
			't',
			'tak',
			'tal',
			'tam',
			'thav',
			'thor',
			'torg',
			'tre',
			'uad',
			'v',
			'var',
			'vic',
			'vis',
			'wrayt',
			'yash',
			'yeng',
			'zash'
		];

		const ends = [
			'a',
			'aadi',
			'aar',
			'ade',
			'aea',
			'aela',
			'aella',
			'aena',
			'ahn',
			'al',
			'ala',
			'an',
			'ani',
			'ania',
			'ann',
			'ar',
			'arai',
			'arr',
			'asar',
			'ash',
			'astra',
			'aver',
			'ber',
			'born',
			'brek',
			'by',
			'ceryn',
			'cian',
			'coe',
			'da',
			'dal',
			'dan',
			'de',
			'der',
			'dinn',
			'dis',
			'don',
			'dry',
			'dryn',
			'dur',
			'e',
			'ea',
			'ed',
			'ederei',
			'eed',
			'ef',
			'eh',
			'eid',
			'eila',
			'eir',
			'eiros',
			'el',
			'elia',
			'ella',
			'ellen',
			'elm',
			'emia',
			'en',
			'end',
			'er',
			'ere',
			'ern',
			'erna',
			'erri',
			'esch',
			'eth',
			'eue',
			'ey',
			'fire',
			'for',
			'gar',
			'gen',
			'gran',
			'han',
			'hild',
			'hit',
			'hun',
			'ia',
			'ia',
			'ialis',
			'ian',
			'ich',
			'ie',
			'iel',
			'ik',
			'ikos,',
			'il',
			'ilar',
			'ild',
			'ilia',
			'in',
			'ina',
			'inia',
			'inua',
			'ior',
			'ir',
			'is',
			'ja',
			'jed',
			'kain',
			'kaston',
			'la',
			'lannan',
			'lee',
			'leth',
			'lie',
			'lin',
			'linn',
			'loda',
			'lyse',
			'meral',
			'na',
			'nan',
			'neth',
			'nor',
			'oane',
			'or',
			'ora',
			'orel',
			'orn',
			'orna',
			'pet',
			'qui',
			'ra',
			'rak',
			'rasa',
			'rash',
			'ree',
			'rek',
			'ret',
			'retor',
			'ri',
			'rian',
			'ric',
			'rich',
			'rie',
			'rin',
			'rinn',
			'rion',
			'runn',
			'rynna',
			'sen',
			'sik',
			'son',
			'stag',
			'striana',
			'tin',
			'tor',
			'tyrd',
			'ur',
			'us',
			'va',
			'vin',
			'vok',
			'vyn',
			'vyre',
			'ya',
			'yas',
			'yle',
			'yne',
			'ynn'
		];

		const separators = [
			'-',
			'\''
		];

		switch (Random.randomNumber(20)) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
				return `${Collections.draw(starts)}${Collections.draw(ends)}`;
			case 10:
			case 11:
			case 12:
			case 13:
				return `${Collections.draw(starts)}${Collections.draw(separators)}${Collections.draw(ends)}`;
			case 14:
				return `${Collections.draw(starts)}${Collections.draw(starts)}${Collections.draw(separators)}${Collections.draw(ends)}`;
			case 15:
				return `${Collections.draw(starts)}${Collections.draw(separators)}${Collections.draw(ends)}${Collections.draw(ends)}`;
			case 16:
				return `${Collections.draw(starts)}${Collections.draw(separators)}${Collections.draw(starts)}${Collections.draw(ends)}`;
			case 17:
				return `${Collections.draw(starts)}${Collections.draw(ends)}${Collections.draw(separators)}${Collections.draw(ends)}`;
			case 18: {
				const separator = Collections.draw(separators);
				return `${Collections.draw(starts)}${separator}${Collections.draw(starts)}${separator}${Collections.draw(ends)}`;
			}
			case 19: {
				const separator = Collections.draw(separators);
				return `${Collections.draw(starts)}${separator}${Collections.draw(ends)}${separator}${Collections.draw(ends)}`;
			}
		}

		return '';
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
