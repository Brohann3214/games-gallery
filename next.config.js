module.exports = {
	async redirects() {
		return [
			{
				source: '/',
				destination: '/latest',
				permanent: false,
			},
		];
	},
};
