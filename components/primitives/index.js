import styled from 'styled-components';
import {
	space,
	color,
	border,
	typography,
	layout,
	flexbox,
	grid,
	shadow,
	system,
	compose,
} from 'styled-system';

export const Box = styled.div(
	compose(space, color, border, typography, layout, flexbox, grid, shadow)
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
	compose(space, color, typography, layout, flexbox, grid, shadow)
);
Heading.defaultProps = {
	fontSize: 4,
};
