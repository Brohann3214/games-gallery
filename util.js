import { RateLimit } from 'async-sema';

const limit = new RateLimit(20, { timeUnit: 10 * 1000 });

export async function fetchWithRateLimit(path, options) {
	await limit();
	return fetch(path, options);
}
