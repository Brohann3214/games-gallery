import { CosmosClient } from '@azure/cosmos';

export function createCacheClient() {
	const client = new CosmosClient({
		endpoint: process.env.COSMOS_ENDPOINT,
		key: process.env.COSMOS_AUTH_TOKEN,
	});
	const database = client.database('forum-games');
	const container = database.container('games');

	async function executeCosmosQuery(queryText, parameters) {
		const { resources: cachedPosts } = await container.items
			.query({
				query: queryText,
				parameters: Object.entries(parameters).map(([name, value]) => ({
					name,
					value,
				})),
			})
			.fetchAll();

		return cachedPosts.map(stripCosmosProperties);
	}

	return {
		// get posts from cache (Discourse API doesn't support bulk fetching posts across topics 🙄)
		async getPostsForTopics(topicIds) {
			return executeCosmosQuery(
				'SELECT * FROM c WHERE ARRAY_CONTAINS(@topicIds, c.topicId)',
				{ '@topicIds': topicIds }
			);
		},

		async getPostsForAuthor(authorId) {
			return executeCosmosQuery(
				'SELECT * FROM c WHERE c.authorId = @authorId',
				{ '@authorId': authorId }
			);
		},

		async bulkUpdatePosts(posts) {
			const operations = posts.map((post) => ({
				operationType: 'Upsert',
				resourceBody: makeCachePost(post),
			}));

			return container.items.bulk(operations);
		},

		async updateSinglePost(post) {
			return container.items.upsert(makeCachePost(post));
		},
	};
}

function makeCachePost(post) {
	return {
		...post,
		id: `${post.topicId}`, // prevent auto key generation; simplifies updating in-place
	};
}

function stripCosmosProperties({
	_rid,
	_self,
	_etag,
	_attachements,
	_ts,
	...rest
}) {
	return rest;
}
