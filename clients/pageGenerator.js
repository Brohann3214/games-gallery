import cheerio from 'cheerio';

import { createCacheClient } from './discourseCacheClient';
import {
	fetchTopTopicsWithGameTag,
	fetchLatestTopicsWithGameTag,
	fetchPostsForTopic,
	makeTopicLink,
} from './discourseClient';

const cacheClient = createCacheClient();

const rangeToFetchMethod = {
	latest: fetchLatestTopicsWithGameTag,
	'all-time': (order) => fetchTopTopicsWithGameTag('all', order),
};

const defaultSortForRange = {
	latest: 'recent',
	'all-time': 'rating',
};

const orderToDiscourseOrder = {
	recent: 'created',
	rating: 'op_likes',
};

// TODO: memoize results during page generation to cut back on api calls?
export async function getGamesForRange(
	range,
	order = defaultSortForRange[range]
) {
	const res = await rangeToFetchMethod[range](orderToDiscourseOrder[order]);

	const resBody = await res.json();
	const { topics } = resBody.topic_list;

	// fetch corresponding posts
	const postsForTopics = await cacheClient.getPostsForTopics(
		topics.map((topic) => topic.id)
	);

	const postsById = Object.fromEntries(
		postsForTopics.map((post) => [post.topicId, post])
	);

	// merge top topics data + order with cached posts
	const posts = [];
	for (const topic of topics) {
		let post = postsById[topic.id];

		if (!post) {
			// cache miss; fetch from Discourse directly
			console.info(
				`No data for topic ${topic.id}; fetching from Discourse...`
			);

			const postsRepsonse = await fetchPostsForTopic(topic.id);
			const postsResponseBody = await postsRepsonse.json();
			const discoursePost = postsResponseBody.post_stream.posts[0];

			post = buildGameDetails(discoursePost, topic.title);

			// add newly fetched post to cache
			await cacheClient.updateSinglePost(post);
		}

		if (!post.gameLink) {
			console.warn(`No game link for topic ${makeTopicLink(topic.id)}`);
			continue;
		}

		posts.push({
			...post,
			topicLink: makeTopicLink(topic.id),
			...(topic.op_like_count && { likeCount: topic.op_like_count }), // TODO: fallback to cached like count for queries that don't return it?
		});
	}

	return posts;
}

export async function getGamesForAuthor(authorId) {
	// fetch corresponding posts
	const postsForAuthor = await cacheClient.getPostsForAuthor(authorId);

	return postsForAuthor
		.filter((post) => {
			if (!post.gameLink) {
				console.warn(
					`No game link for topic ${makeTopicLink(post.topicId)}`
				);
				return false;
			}

			return true;
		})
		.sort((a, z) => z.likeCount - a.likeCount)
		.map((post) => ({ ...post, topicLink: makeTopicLink(post.topicId) }));
}

export function buildGameDetails(discoursePostObject, fallbackTitle) {
	const likelyGame = findGameLink(discoursePostObject);
	if (!likelyGame) {
		console.warn(
			`Couldn't find game link for ${makeTopicLink(
				discoursePostObject.topic_id
			)}/${discoursePostObject.post_number}`
		);
	}

	const imgSrc = findGameThumbnail(discoursePostObject);

	const likeActions = discoursePostObject.actions_summary?.find(
		({ id }) => id === 2
	);

	return {
		topicId: discoursePostObject.topic_id,
		postId: discoursePostObject.id,
		created: discoursePostObject.created_at,
		...(likelyGame?.url && { gameLink: likelyGame?.url }),
		title: likelyGame?.title ?? fallbackTitle,
		author: discoursePostObject.username,
		authorId: discoursePostObject.user_id,
		likeCount: likeActions?.count ?? 0,
		...(imgSrc && { imgSrc }),
	};
}

export function findGameLink(discoursePostObject) {
	const links = discoursePostObject.link_counts;

	if (!links?.length) {
		return;
	}

	// primary share link format
	let likelyGame = links.find(({ url }) =>
		url.match(/^https:\/\/arcade.makecode.com\/([0-9]{5}-){3}[0-9]{5}$/)
	);

	// alternate share link format
	if (!likelyGame) {
		likelyGame = links.find(({ url }) =>
			url.match(/^https:\/\/makecode.com\/_[a-zA-Z0-9]+$/)
		);
	}

	// git hub pages format
	if (!likelyGame) {
		likelyGame = links.find(({ url }) =>
			url.match(/^https:\/\/[\w-]+\.github.io\/[\w-]+\/$/)
		);
	}

	return likelyGame;
}

export function findGameThumbnail(discoursePostObject) {
	// TODO: try harder to get imgSrcs?
	const $ = cheerio.load(discoursePostObject.cooked);
	const imgSrc = $('.onebox .onebox-body .aspect-image img').attr('src');

	return imgSrc;
}
