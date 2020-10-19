import { CosmosClient } from '@azure/cosmos';

export function createCacheClient() {
	const client = new CosmosClient({
		endpoint: process.env.COSMOS_ENDPOINT,
		key: process.env.COSMOS_AUTH_TOKEN,
	});
	const database = client.database('forum-games');
	const container = database.container('games');

	return {
		// get posts from cache (Discourse API doesn't support bulk fetching posts across topics 🙄)
		async getPostsForTopics(topicIds) {
			const { resources: cachedPosts } = await container.items
				.query({
					query:
						'SELECT * from c WHERE ARRAY_CONTAINS(@topicIds, c.topicId)',
					parameters: [
						{
							name: '@topicIds',
							value: topicIds,
						},
					],
				})
				.fetchAll();

			return cachedPosts.map(
				// strip extra Cosmos properties
				({ _rid, _self, _etag, _attachements, _ts, ...post }) => post
			);
		},

		async bulkUpdatePosts(posts) {
			const operations = posts.map((post) => ({
				operationType: 'Upsert',
				resourceBody: {
					...post,
					id: `${post.topicId}`, // prevent auto key generation; makes it easier to update in-place
				},
			}));

			return container.items.bulk(operations);
		},
	};
}
