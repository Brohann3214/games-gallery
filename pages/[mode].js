import { getGamesForRange } from '../clients/pageGenerator';
import { GamesGrid } from '../components/GamesGrid';
import { GeneratedFooter } from '../components/GeneratedFooter';
import { Heading, Box } from '../components/primitives';

export default function GamesGallery({ title, posts, generated }) {
	return (
		<Box>
			<Heading marginY={4}>{title}</Heading>
			<GamesGrid posts={posts} />
			<GeneratedFooter generated={generated} />
		</Box>
	);
}

const modeToTitle = {
	latest: 'Most recently posted forum games',
	'all-time': 'Most ❤️’d forum games',
};

export async function getStaticProps({ params }) {
	const { mode } = params;
	const posts = await getGamesForRange(mode);
	return {
		props: {
			title: modeToTitle[mode],
			posts,
			generated: new Date().toISOString(),
		},
		revalidate: 30,
	};
}

export async function getStaticPaths() {
	return {
		paths: [
			{ params: { mode: 'latest' } }, // default sort: recent
			{ params: { mode: 'all-time' } }, // default sort: rating
		],
		fallback: false,
	};
}
