import { Box } from './primitives';

export function GeneratedFooter({ generated }) {
	return (
		<Box
			fontSize={1}
			marginTop={5}
			marginBottom={4}
			paddingBottom={2}
			textAlign="right"
			color="subtleText"
		>
			Generated {generated}
		</Box>
	);
}
