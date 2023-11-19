import { RateLimit } from 'async-sema';

const discourseBaseURL = 'https://forum.makecode.com';
const fetchOptions = {
	headers: {
		Accept: 'application/json',
	},
};

// EXPECT: path is already properly encoded
export async function fetchArbitraryDiscourseResults(path) {
	return fetchWithRateLimit(`${discourseBaseURL}/${path}`, fetchOptions);
}

export async function fetchPostsForTopic(topicId, postIds) {
	const params =
		postIds &&
		postIds.map((x) => `post_ids[]=${encodeURIComponent(x)}`).join('&');

	return fetchWithRateLimit(
		`${makeTopicLink(topicId)}${params ? `/posts?${params}` : ''}`,
		fetchOptions
	);
}

const discoursePageSize = 20;
export async function fetchAllPostsForTopic(topicId) {
	let postsResponse = await fetchPostsForTopic(topicId);
	let postsResponseBody = await postsResponse.json();

	const { posts, stream } = postsResponseBody.post_stream;

	let page = 1;
	const pageCount = Math.ceil(stream.length / discoursePageSize); // discourse page size

	while (page < pageCount) {
		const offset = page * discoursePageSize;
		const postIds = stream.slice(offset, offset + discoursePageSize);

		postsResponse = await fetchPostsForTopic(topicId, postIds);
		postsResponseBody = await postsResponse.json();

		posts.push(...postsResponseBody.post_stream.posts);

		page++;
	}

	return posts;
}

// flag: one of ["all", "yearly", "quarterly", "monthly", "weekly", "daily"]
// order: one of ["default", "created", "activity", "views", "posts", "category", "likes", "op_likes", "posters"]
export async function fetchTopTopicsWithGameTag(flag, order) {
	// prettier-ignore
	return fetchWithRateLimit(
		`${discourseBaseURL}/top/${encodeURIComponent(flag)}?order=${encodeURIComponent(order)}`,
		fetchOptions
	);
}

// order: one of ["default", "created", "activity", "views", "posts", "category", "likes", "op_likes", "posters"]
export async function fetchLatestTopicsWithGameTag(order) {
	// prettier-ignore
	return fetchWithRateLimit(
		`${discourseBaseURL}/latest?order=${encodeURIComponent(order)}`,
		fetchOptions
	);
}

export function makeTopicLink(topicId) {
	return `${discourseBaseURL}/t/${encodeURIComponent(topicId)}`;
}

// stay under Discourse's rate limit; intentionally sharing RateLimit instance
async function fetchWithRateLimit(path, options) {
	//console.log(`${options?.method ?? 'GET'} ${path}`);

	await limit();
	return fetch(path, options);
}

const limit = new RateLimit(20, { timeUnit: 10 * 1000 });
