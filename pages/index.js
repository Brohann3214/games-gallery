import { Box } from '../components/primitives';

export default function Home() {
	return (
		<Box padding={3} paddingBottom={4} maxWidth="800px">
			<p>
				Hi!{' '}
				<span role="img" aria-label="Waving hand">
					👋
				</span>{' '}
				Welcome to an unofficial gallery view for the{' '}
				<a href="https://forum.makecode.com/">MakeCode forums</a>!
			</p>
			<p>
				<strong>
					<a href="https://arcade.makecode.com">MakeCode Arcade</a> is
					great
				</strong>
				, and I love seeing the things people build in it! Sometimes
				it’s hard for me to keep track of the new games that are showing
				up, though.{' '}
				<span role="img" aria-label="Smiling guy with a sweat drop">
					😅
				</span>
			</p>
			<p>
				This site is an attempt to reformat the forums into a more
				browsable game library. All of the pages of this site have
				direct equivalents on the forums:
			</p>
			<dl>
				<PageHeading>
					<a href="/latest">Latest</a>
				</PageHeading>
				<dd>
					a view of the{' '}
					<a href="https://forum.makecode.com/tag/game?ascending=false&amp;order=created">
						most recently created topics that feature the game tag
					</a>
					.
				</dd>

				<PageHeading>
					<a href="/all-time">All-time</a>
				</PageHeading>
				<dd>
					a view of the{' '}
					<a href="https://forum.makecode.com/top/all?tags[]=game&amp;order=op_likes">
						all time top topics ordered by likes on the first post
					</a>
					.
				</dd>

				<PageHeading>
					<a href="/author/527">Author</a>
				</PageHeading>
				<dd>
					a view of the{' '}
					<a href="https://forum.makecode.com/search?q=tag%3Agame%20%40jacob_c%20in%3Afirst%20order%3Alikes">
						games posted by a specific author
					</a>
					; this one you get to by clicking on the link in a game
					tile.
				</dd>
			</dl>
		</Box>
	);
}

function PageHeading({ children }) {
	return (
		<Box as="dt" mt={3} fontWeight="bold">
			{children}
		</Box>
	);
}
