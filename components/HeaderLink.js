import styled from 'styled-components';
import css from '@styled-system/css';

export const HeaderLink = styled.a(
	css({
		textDecoration: 'none',
		color: 'pageHeaderColor',

		'&:hover': {
			textDecoration: 'none',
			color: 'headerLinkHover',
		},
	})
);
