module.exports = {
	async redirects() {
		return [
			{
				source: '/',
				destination: '/newest',
				permanent: true,
			},
		];
	},
};
