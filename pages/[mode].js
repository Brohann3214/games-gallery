import { getTopGamesForTimePeriod } from '../clients/pageGenerator';
import { GameTile } from '../components/GameTile';
import { Heading, Box } from '../components/primitives';

const modeToFlag = {
	newest: {
		flag: 'latest',
		title: 'Newest forum games',
	},
	latest: {
		flag: 'monthly',
		title: 'Top forum games from last 30 days',
	},
	'all-time': {
		flag: 'all',
		title: 'All time top forum games',
	},
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
	const { mode } = params;
	const { flag, options, title } = modeToFlag[mode];
	const posts = await getTopGamesForTimePeriod(flag, options);
	return {
		props: {
			title,
			posts,
			generated: new Date().toISOString(),
		},
		revalidate: 1,
	};
}

export async function getStaticPaths() {
	return {
		paths: [
			{ params: { mode: 'latest' } },
			{ params: { mode: 'all-time' } },
			{ params: { mode: 'newest' } },
		],
		fallback: false,
	};
}
