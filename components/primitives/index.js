import styled from 'styled-components';
import {
	layout,
	space,
	color,
	border,
	typography,
	flexbox,
	grid,
	shadow,
	system,
	compose,
} from 'styled-system';

export const Box = styled.div(
	compose(layout, space, color, border, typography, flexbox, grid, shadow)
);

export const Stack = styled(Box)`
	& > * + * {
		${system({
			spacing: {
				property: 'margin-top',
				scale: 'space',
			},
		})}
	}
`;

export const HorizontalStack = styled(Box)`
	& > * + * {
		${system({
			spacing: {
				property: 'margin-left',
				scale: 'space',
			},
		})}
	}
`;
HorizontalStack.defaultProps = {
	display: 'flex',
};

export const Image = styled.img(compose(space, layout));

export const Heading = styled.header(
	compose(layout, space, color, typography, flexbox, grid, shadow)
);
Heading.defaultProps = {
	fontSize: 4,
};

export const Text = styled.span(compose(layout, typography));
