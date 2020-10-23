import Link from 'next/link';
import styled from 'styled-components';
import { Box, Stack, Image } from './primitives';

const fallbackImgUrl =
	'https://pxt.azureedge.net/api/47446-72417-42947-36047/thumb';

// TODO: likeCount?
export function GameTile({
	topicLink,
	gameLink,
	title,
	author,
	authorId,
	imgSrc,
}) {
	return (
		<Stack
			spacing={2}
			padding={3}
			css={`
				border: solid 2px transparent;

				&:hover {
					background-color: white;
					border-color: ${({ theme }) =>
						theme.colors.pageHeaderSecondaryColor};
				}
			`}
		>
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
				<TrimmedTextBox title={title}>
					<a href={gameLink}>{title}</a>
				</TrimmedTextBox>
				<Box fontSize={2} marginTop={1} display="flex">
					<TrimmedTextBox flex="1 1">
						by{' '}
						<a href={`/author/${encodeURIComponent(authorId)}`}>
							{author}
						</a>
					</TrimmedTextBox>
					<Box marginLeft={1}>
						<a href={topicLink}>forum</a>
					</Box>
				</Box>
			</Box>
		</Stack>
	);
}

const TrimmedTextBox = styled(Box)`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
`;
