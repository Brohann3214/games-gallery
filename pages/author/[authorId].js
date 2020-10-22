import Error from 'next/error';
import { useRouter } from 'next/router';
import { getGamesForAuthor } from '../../clients/pageGenerator';
import { GameTile } from '../../components/GameTile';
import { Heading, Box } from '../../components/primitives';

export default function GamesGallery({ title, posts, generated }) {
	const router = useRouter();

	if (router.isFallback) {
		return <Box>Loading...</Box>;
	}

	if (!posts.length) {
		return <Error statusCode={404} />;
	}

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
	const { authorId } = params;

	const parsedId = parseInt(authorId, 10);
	const posts = !isNaN(parsedId) ? await getGamesForAuthor(parsedId) : [];
	const title = posts.length ? `Games by ${posts[0].author}` : null;

	return {
		props: {
			title,
			posts,
			generated: new Date().toISOString(),
		},
		revalidate: 30,
	};
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: true,
	};
}
