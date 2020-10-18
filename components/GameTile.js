import { Box, Image } from './primitives';

const fallbackImgUrl =
	'https://pxt.azureedge.net/api/47446-72417-42947-36047/thumb';

export function GameTile({
	threadLink,
	gameLink,
	title,
	author,
	imgSrc,
	likeCount, // TODO
}) {
	return (
		<Box
			display="grid"
			gridTemplateColumns="160px auto"
			gridAutoRows="1fr"
			gridGap="16px"
		>
			<Box>
				<Image
					maxWidth="160px"
					maxHeight="120px"
					src={imgSrc ?? fallbackImgUrl}
				/>
			</Box>
			<Box display="flex" flexDirection="column">
				<Box>
					<a href={gameLink}>{title}</a>
				</Box>
				<Box>by {author}</Box>
				<Box>
					<a href={threadLink}>forum link</a>
				</Box>
			</Box>
		</Box>
	);
}
