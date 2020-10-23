import Head from 'next/head';
import { getGamesForRange } from '../clients/pageGenerator';
import { GamesGrid } from '../components/GamesGrid';
import { GeneratedFooter } from '../components/GeneratedFooter';
import { Heading, Box } from '../components/primitives';

export default function GamesGallery({ title, pageTitle, posts, generated }) {
	return (
		<Box>
			<Head>
				<title>{pageTitle}: games gallery</title>
			</Head>
			<Heading margin={3} marginTop={4}>
				{title}
			</Heading>
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
			pageTitle: mode,
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
