import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Box, HorizontalStack } from '../components/primitives';
import { HeaderLink } from '../components/HeaderLink';

const theme = {
	space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
	colors: {
		pageBackground: '#fff8f5',

		pageHeaderBackground: '#5c406c',
		pageHeaderColor: '#ffffff',
		pageHeaderSecondaryColor: '#d6c3e0',
		headerLinkHover: '#e5cdc4',

		subtleText: '#d4cfcb',
	},
	fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
};

const GlobalStyle = createGlobalStyle`
		body {
			margin: 0;
			padding: 0;
			font-family: Helvetica, Arial, sans-serif;
			background: ${({ theme }) => theme.colors.pageBackground}
		}
	
		a {
			text-decoration: none;
	
			&:hover {
				text-decoration: underline;
			}
		}
	`;

export default function App({ Component, pageProps }) {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<HorizontalStack
				as="header"
				paddingX={4}
				paddingY={3}
				spacing={3}
				fontSize={3}
				bg="pageHeaderBackground"
				color="pageHeaderColor"
				justifyContent="flex-end"
				css={`
					white-space: nowrap;
				`}
			>
				<Box color="pageHeaderSecondaryColor">top</Box>
				<HeaderLink href="/latest">latest</HeaderLink>
				<HeaderLink href="/all-time">all-time</HeaderLink>
				<Box
					width="2px"
					alignSelf="stretch"
					bg="pageHeaderSecondaryColor"
				/>
				<HeaderLink href="/newest">newest</HeaderLink>
			</HorizontalStack>
			<Box paddingX={4}>
				<Component {...pageProps} />
			</Box>
		</ThemeProvider>
	);
}
