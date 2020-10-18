import { getPostsForTopTopicsWithGameTag } from '../clients/discourseClient';
import { GameTile } from '../components/GameTile';
import { Heading, Box } from '../components/primitives';

const modeToFlag = {
	latest: { flag: 'monthly', title: 'Top forum games from last 30 days' },
	'all-time': { flag: 'all', title: 'All time top forum games' },
};

export async function getStaticProps({ params }) {
	const { flag, title } = modeToFlag[params.mode];
	const posts = await getPostsForTopTopicsWithGameTag(flag);
	return {
		props: {
			title,
			posts,
			generated: new Date().toISOString(),
		},
		revalidate: 60 * 60, // 1hr
	};
}

export async function getStaticPaths() {
	return {
		paths: [
			{ params: { mode: 'latest' } },
			{ params: { mode: 'all-time' } },
		],
		fallback: false,
	};
}

export default function GamesGallery({ title, posts, generated }) {
	return (
		<Box>
			<Heading marginY={4} fontSize={4}>
				{title}
			</Heading>
			<Box
				display="grid"
				gridGap="16px"
				gridTemplateColumns="repeat(auto-fit, 380px)"
			>
				{posts.map(({ postId, ...props }) => (
					<GameTile key={postId} {...props} />
				))}
			</Box>
			<Box
				marginTop={5}
				marginBottom={4}
				textAlign="right"
				color="subtleText"
			>
				Generated {generated}
			</Box>
		</Box>
	);
}
