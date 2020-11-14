import { BASE62_CHARSET as CHARSET } from '@sudoku/constants';

export default class Base62 {
	/**
	 * @param {BigInt} bigInt
	 * @returns {string}
	 */
	static encode(bigInt) {
		let base = BigInt(CHARSET.length);
		let result = '';

		while (0 < bigInt) {
			result = CHARSET.charAt(Number(bigInt % base)) + result;
			bigInt = bigInt / base;
		}

		return result || '0';
	}

	/**
	 * @param {string} base62
	 * @returns {BigInt}
	 */
	static decode(base62) {
		let base = BigInt(CHARSET.length);
		let result = 0n;

		for (let i = 0; i < base62.length; i++) {
			result = result * base + BigInt(CHARSET.indexOf(base62[i]));
		}

		return result;
	}
}