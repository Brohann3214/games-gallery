import fetch from 'node-fetch';
global.fetch = fetch; // ew; sorry...

import { gameOverrides } from './gameOverrides';
import {
	fetchArbitraryDiscourseResults,
	fetchAllPostsForTopic,
	makeTopicLink,
} from '../../clients/discourseClient';
import {
	buildGameDetails,
	findGameLink,
	findGameThumbnail,
} from '../../clients/pageGenerator';
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
		if (nextPage && nextPage.startsWith('/')) {
			nextPage = nextPage.substring(1);
		}

		pageIndex++;

		console.log(`Got ${topics.length} topics; processing.`);

		let games = [];
		for (const topic of topics) {
			const allPosts = await fetchAllPostsForTopic(topic.id);

			const [originalPost, ...replies] = allPosts;

			const gameOverride = gameOverrides[topic.id];
			const [preferredGamePostId, expectedLastGamePostIdByAuthor] =
				gameOverride ?? [];
			let lastGamePostIdByAuthor;

			let gameDetails = buildGameDetails(originalPost, topic.title);

			let updateMessage;

			for (const reply of replies) {
				if (gameOverride) {
					// track last game-looking post by user
					if (
						reply.user_id === originalPost.user_id &&
						findGameLink(reply)
					) {
						lastGamePostIdByAuthor = reply.id;
					}

					// update game
					if (reply.id === preferredGamePostId) {
						updateMessage =
							`Updated ${makeTopicLink(reply.topic_id)} ` +
							`with manually curated ` +
							`${makeTopicLink(reply.topic_id)}/${
								reply.post_number
							}`;
						gameDetails = updateGameInfo(gameDetails, reply);
					}
				} else {
					// try to update if reply is by op
					if (reply.user_id === originalPost.user_id) {
						const update = updateGameInfo(gameDetails, reply);
						if (update) {
							updateMessage =
								`Updated ${makeTopicLink(reply.topic_id)} ` +
								`with ${makeTopicLink(reply.topic_id)}/${
									reply.post_number
								}`;
							gameDetails = update;
						}
					}
				}
			}

			if (updateMessage) {
				console.log(updateMessage);
			}

			if (lastGamePostIdByAuthor !== expectedLastGamePostIdByAuthor) {
				console.error(
					`ERROR: Unhandled game-like post by OP in topic with hardcoded post expectations: ` +
						`topic ${topic.id}, post ${lastGamePostIdByAuthor}`
				);

				// set a non-zero exit code, so GitHub Actions notifies
				process.exitCode = -1;
			}

			games.push(gameDetails);
		}

		await cacheClient.bulkUpdatePosts(games);
	}
}

function updateGameInfo(gameDetails, post) {
	const { title, gameLink, imgSrc, ...sharedGameDetails } = gameDetails;
	const update = findGameLink(post);
	if (update?.url) {
		const thumbnailUpdate = findGameThumbnail(post);
		return {
			...sharedGameDetails,
			gameLink: update.url,
			title: update.title ?? title,
			imgSrc: thumbnailUpdate,
		};
	}
}

main()
	.catch((err) => {
		console.error(err);
		process.exit(-1);
	})
	.then(() => console.log('Done!'));
