import fetch from 'node-fetch';
global.fetch = fetch; // ew; sorry...

import {
	fetchArbitraryDiscourseResults,
	fetchPostsForTopic,
} from '../../clients/discourseClient';
import { buildGameDetails } from '../../clients/pageGenerator';
import { createCacheClient } from '../../clients/discourseCacheClient';

async function main() {
	const cacheClient = createCacheClient();

	// sort created *ascending* to avoid torn reads between pages (new topics added to end of list); Discourse API 🙄
	let nextPage =
		'latest?ascending=true&no_definitions=true&order=created&tags%5B%5D=game';
	let pageIndex = 1;

	while (nextPage) {
		console.log(`Fetching ${pageIndex}...`);

		const topicsResponse = await fetchArbitraryDiscourseResults(nextPage);

		const topicsResponseBody = await topicsResponse.json();
		const { topics, more_topics_url } = topicsResponseBody.topic_list;

		nextPage = more_topics_url;
		pageIndex++;

		console.log(`Got ${topics.length} topics; processing.`);

		let posts = [];
		for (const topic of topics) {
			const postsResponse = await fetchPostsForTopic(topic.id);

			const postsResponseBody = await postsResponse.json();
			const post = postsResponseBody.post_stream.posts[0];

			const gameDetails = buildGameDetails(post, topic.title);
			posts.push(gameDetails);
		}

		await cacheClient.bulkUpdatePosts(posts);
	}
}

main()
	.catch((err) => {
		console.error(err);
		process.exit(-1);
	})
	.then(() => console.log('Done!'));
