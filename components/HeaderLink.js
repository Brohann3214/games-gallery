import styled from 'styled-components';
import css from '@styled-system/css';

export function HeaderLink({ href, children }) {
	return <HeaderLinkAnchor href={href}>{children}</HeaderLinkAnchor>;
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
