var twitter2mongodb = require('twitter2mongodb');

// (options) Initialize options object
var options = {
	twitter: {},
	mongodb: {}
};

// *** CONNECTION SETUP ***

// (options_twitter_connection) Twitter API connection keys
options.twitter.connection =  {
	consumer_key: 'gsQeNlBXS9mwjPeTwUA2mljYz', // process.env.TWITTER_CONSUMER_KEY
	consumer_secret: '9wJgEjEewzWPpoFMVaqK36lcG3RJbQy2ymGL3PX4Xzfqpm7cK9', // process.env.TWITTER_CONSUMER_SECRET
	access_token_key: '1085876219214790656-59wB6VT9S8ze7sixJqfJ3JKp6FM0UP', // process.env.TWITTER_ACCESS_TOKEN_KEY
	access_token_secret: 'xtwwFJmPV1kVR1wjGaRjMsvGVHnhvueTvLi8szcuGyTjE' // process.env.TWITTER_ACCESS_TOKEN_SECRET
};

// (options_mongodb_connection) MongoDB connection details
// Format: 'mongodb://<user>:<password>@<host>:<port>/<database>'
options.mongodb.connection = 'mongodb:http://localhost:27017/test/data';

// *** SEARCH TWEETS ***

// (options_twitter_rest) Search for keyword 'twitter' in path 'GET search/tweets'
options.twitter.method = 'post'; // get, post, or stream
options.twitter.path = 'followers/list'; // api path
//options.twitter.params = {q: 'twitter'}; // query tweets

// (options_jsonata) Filter for statuses array using jsonata
//options.jsonata = 'statuses';

// (options_mongodb) MongoDB options
options.mongodb.method = 'insertMany'; // insert many objects due to array

// (twitter2mongodb_rest) Query tweets using REST API into MongoDB collection
twitter2mongodb(options)
	.then(data => {
		console.log(data);
	}).catch(err => {
		console.error(err.message);
	});

// *** STREAM TWEETS ***

// (options_twitter_connection) Track keyword 'twitter' in path 'POST statuses/filter'
// options.twitter.method = 'stream'; // get, post, or stream
// options.twitter.path = 'statuses/filter'; // api path
// options.twitter.params = {track: 'twitter'}; // query tweets

// // (options_mongodb) MongoDB options
// options.mongodb.method = 'insertOne';

// // (options_jsonata) Remove jsonata filter
// delete options.jsonata;

// // (twitter2mongodb_stream) Stream tweets into MongoDB collection
// var stream = twitter2mongodb(options);
// stream.on('error', function(error) {
// 	console.error(error.message);
// });
