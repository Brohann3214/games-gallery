import { GameTile } from './GameTile';
import { Box } from './primitives';

export function GamesGrid({ posts }) {
	return (
		<Box
			display="grid"
			gridTemplateColumns="repeat(auto-fill, minmax(240px, 1fr))"
			gridGap={3}
		>
			{posts.map(({ postId, ...props }) => (
				<GameTile key={postId} {...props} />
			))}
		</Box>
	);
}
