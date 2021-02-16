import styled from 'styled-components';
import { Box, Stack, Image } from './primitives';

const fallbackImgUrl =
	'https://pxt.azureedge.net/api/47446-72417-42947-36047/thumb';

export function GameTile({
	topicLink,
	gameLink,
	title,
	author,
	authorId,
	imgSrc,
	likeCount,
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
					{likeCount != null && (
						<Box color="subtleText" marginRight={2}>
							<SmallHeartIcon /> {likeCount}
						</Box>
					)}

					<TrimmedTextBox flex="1 1">
						by{' '}
						<a href={`/author/${encodeURIComponent(authorId)}`}>
							{author}
						</a>
					</TrimmedTextBox>

					<Box marginLeft={2}>
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

function SmallHeartIcon() {
	// from Discourse, which looks like it might use font awesome, so here's a link to fa's license:
	// https://fontawesome.com/license
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			fill="currentColor"
			height="11"
			style={{ filter: 'opacity(50%)' }}
		>
			<path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
		</svg>
	);
}
