import cheerio from 'cheerio';
import { fetchWithRateLimit } from '../util';

// It'd be great if Discourse provided a better api for fetching first posts
// for a list of topics, but I didn't find one... n+1 queries here we come!
export async function getPostsForTopTopicsWithGameTag(scope) {
	const res = await fetchWithRateLimit(
		`https://forum.makecode.com/top/${encodeURIComponent(
			scope
		)}.json?order=op_likes&tags%5B%5D=game`
	);

	const topTopics = await res.json();

	const posts = [];
	for (const topic of topTopics.topic_list.topics) {
		if (posts.length >= 25) {
			break;
		}

		const res = await fetchWithRateLimit(
			`https://forum.makecode.com/t/${topic.id}/posts.json`
		);
		const postsResponse = await res.json();

		const post = postsResponse.post_stream.posts[0];
		if (!post.link_counts?.length) {
			console.warn(
				`No links for post ${post.id} in thread ${makeThreadLink(
					post.topic_id
				)}`
			);
			continue;
		}

		const likelyGame = findGameLink(post.link_counts);
		if (!likelyGame) {
			console.warn(
				`Couldn't find game for post ${
					post.id
				} in thread ${makeThreadLink(post.topic_id)}`
			);
			continue;
		}

		const $ = cheerio.load(post.cooked);
		const imgSrc = $('.onebox .onebox-body .aspect-image img').attr('src');

		posts.push({
			postId: post.id,
			threadLink: makeThreadLink(post.topic_id),
			gameLink: likelyGame.url,
			title: likelyGame.title ?? topic.title,
			author: post.username,
			imgSrc: imgSrc ?? null,
			likeCount: topic.op_like_count,
		});
	}

	return posts;
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
			url.match(/^https:\/\/[\w\-]+\.github.io\/[\w\-]+\/$/)
		);
	}

	return likelyGame;
}

function makeThreadLink(threadId) {
	return `https://forum.makecode.com/t/${encodeURIComponent(threadId)}`;
}
