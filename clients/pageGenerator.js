import cheerio from 'cheerio';

import { createCacheClient } from './discourseCacheClient';
import {
	fetchTopTopicsWithGameTag,
	fetchLatestTopicsWithGameTag,
	fetchPostsForTopic,
	makeTopicLink,
} from './discourseClient';

const cacheClient = createCacheClient();

export async function getTopGamesForTimePeriod(scope, order) {
	// fetch top topics
	const res = await (scope === 'latest'
		? fetchLatestTopicsWithGameTag()
		: fetchTopTopicsWithGameTag(scope, order));

	const topTopics = await res.json();
	const { topics } = topTopics.topic_list;

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
			...(topic.op_like_count && { likeCount: topic.op_like_count }),
		});
	}

	return posts;
}

export function buildGameDetails(discoursePostObject, fallbackTitle) {
	const likelyGame = findGameLink(discoursePostObject.link_counts);
	if (!likelyGame) {
		console.warn(
			`Couldn't find game link for post ${
				discoursePostObject.id
			} in thread ${makeTopicLink(discoursePostObject.topic_id)}`
		);
	}

	// TODO: try harder to get imgSrcs?
	const $ = cheerio.load(discoursePostObject.cooked);
	const imgSrc = $('.onebox .onebox-body .aspect-image img').attr('src');

	return {
		topicId: discoursePostObject.topic_id,
		postId: discoursePostObject.id,
		...(likelyGame?.url && { gameLink: likelyGame?.url }),
		title: likelyGame?.title ?? fallbackTitle,
		author: discoursePostObject.username,
		...(imgSrc && { imgSrc }),
	};
}

function findGameLink(links) {
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
