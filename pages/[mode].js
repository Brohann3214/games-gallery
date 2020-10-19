import { getTopGamesForTimePeriod } from '../clients/pageGenerator';
import { GameTile } from '../components/GameTile';
import { Heading, Box } from '../components/primitives';

const modeToFlag = {
	latest: { flag: 'monthly', title: 'Top forum games from last 30 days' },
	'all-time': { flag: 'all', title: 'All time top forum games' },
};

export default function GamesGallery({ title, posts, generated }) {
	return (
		<Box>
			<Heading marginY={4} fontSize={4}>
				{title}
			</Heading>
			<Box
				display="grid"
				gridTemplateColumns="repeat(auto-fill, minmax(240px, 1fr))"
				gridGap={3}
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

export async function getStaticProps({ params }) {
	const { flag, title } = modeToFlag[params.mode];
	const posts = await getTopGamesForTimePeriod(flag);
	return {
		props: {
			title,
			posts,
			generated: new Date().toISOString(),
		},
		revalidate: 5 * 60, // 5 minutes
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
