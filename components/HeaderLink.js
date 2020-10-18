import Link from 'next/link';
import styled from 'styled-components';
import css from '@styled-system/css';

export function HeaderLink({ href, children }) {
	return (
		<Link href={href} passHref>
			<HeaderLinkAnchor>{children}</HeaderLinkAnchor>
		</Link>
	);
}

const HeaderLinkAnchor = styled.a(
	css({
		textDecoration: 'none',
		color: 'pageHeaderColor',

		'&:hover': {
			textDecoration: 'none',
			color: 'headerLinkHover',
		},
	})
);
