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
		html {
			background-color: ${({ theme }) => theme.colors.pageHeaderBackground}
		}

		body {
			margin: 0;
			padding: 0;
			font-family: Helvetica, Arial, sans-serif;
			background-color: ${({ theme }) => theme.colors.pageBackground}
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
			<Box fontSize={3}>
				<Box
					display="flex"
					paddingX={4}
					paddingY={3}
					bg="pageHeaderBackground"
					color="pageHeaderColor"
				>
					<Box>
						<HeaderLink href="/">
							<HomeIcon />
							&emsp;games gallery
						</HeaderLink>
					</Box>
					<HorizontalStack
						as="header"
						flex="1 1"
						spacing={3}
						justifyContent="flex-end"
						css={`
							white-space: nowrap;
						`}
					>
						<HeaderLink href="/latest">latest</HeaderLink>
						<Box
							width="2px"
							alignSelf="stretch"
							bg="pageHeaderSecondaryColor"
						/>
						<HeaderLink href="/all-time">all-time</HeaderLink>
					</HorizontalStack>
				</Box>
				<Box paddingX={3}>
					<Component {...pageProps} />
				</Box>
			</Box>
		</ThemeProvider>
	);
}

function HomeIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 50 50"
			fill="currentcolor"
			height="18px"
			css={`
				position: relative;
				top: 3px;
			`}
		>
			<path d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"></path>
		</svg>
	);
}
