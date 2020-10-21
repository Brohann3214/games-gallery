import { Box, Stack, Image } from './primitives';

const fallbackImgUrl =
	'https://pxt.azureedge.net/api/47446-72417-42947-36047/thumb';

// TODO: likeCount?
export function GameTile({ topicLink, gameLink, title, author, imgSrc }) {
	return (
		<Stack spacing={1}>
			{/* TODO: improve sizing/placement of these images */}
			<Box
				width="100%"
				height="0"
				paddingBottom="calc(100% * (120 / 160))"
				overflow="hidden"
			>
				<a href={gameLink}>
					<Image
						width="100%"
						height="auto"
						src={imgSrc ?? fallbackImgUrl}
						css={`
							image-rendering: crisp-edges;
							image-rendering: pixelated;
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
