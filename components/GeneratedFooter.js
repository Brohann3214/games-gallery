import { Box } from './primitives';

export function GeneratedFooter({ generated }) {
	return (
		<Box
			marginTop={5}
			marginBottom={4}
			textAlign="right"
			color="subtleText"
		>
			Generated {generated}
		</Box>
	);
}
