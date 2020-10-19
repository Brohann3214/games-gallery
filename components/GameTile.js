import { Box, Stack, Image } from './primitives';

const fallbackImgUrl =
	'https://pxt.azureedge.net/api/47446-72417-42947-36047/thumb';

export function GameTile({
	topicLink,
	gameLink,
	title,
	author,
	imgSrc,
	likeCount, // TODO
}) {
	return (
		<Stack spacing={1}>
			<Box>
				<a href={gameLink}>
					<Image
						width="100%"
						src={imgSrc ?? fallbackImgUrl}
						css={`
							object-fit: contain;
						`}
					/>
				</a>
			</Box>
			<Box>
				<Box
					css={`
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
					`}
				>
					<a href={gameLink}>{title}</a>
				</Box>
				<Box>by {author}</Box>
				<Box>
					<a href={topicLink}>forum</a>
				</Box>
			</Box>
		</Stack>
	);
}
