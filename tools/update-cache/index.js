const path = require('path');

// configure environment
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// configure babel
require('@babel/register')({
	extends: path.resolve(__dirname, '../.babelrc'),
	ignore: [/node_modules/],
});
require('core-js');

// run script
require('./update-cache-main');
