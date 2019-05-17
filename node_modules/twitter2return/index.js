// Richard Wen
// rrwen.dev@gmail.com

var jsonata = require('jsonata');
var Twitter = require('twitter');

/**
 * Extract data from the Twitter Application Programming Interface (API).
 *
 * * {@link https://developer.twitter.com/en/docs Twitter Developer Documentation}
 *
 * @module twitter2return
 *
 * @param {Object} [options={}] options for this function.
 * @param {Object} [options.twitter={}] options for {@link https://www.npmjs.com/package/twitter twitter}.
 * @param {Object} [options.twitter.method=process.env.TWITTER_METHOD || 'get'] Twitter API request method in lowercase letters ('get', 'post', 'delete', or 'stream').
 * @param {Object} [options.twitter.path=process.env.TWITTER_PATH || 'search/tweets'] Twitter API endpoint path (such as 'search/tweets' for 'get' or 'statuses/filter' for 'stream').
 *
 * * For REST API endpoints, see {@link https://developer.twitter.com/en/docs/api-reference-index Twitter API Reference Index}
 * * For Streaming endpoints, see {@link https://developer.twitter.com/en/docs/tweets/filter-realtime/overview Filter Realtime Tweets}
 *
 * @param {Object} [options.twitter.params=process.env.TWITTER_PARAMS || {q:'twitter'}] Twitter API parameters for the `options.twitter.method` and `options.twitter.path`.
 *
 * * For REST API endpoints, see {@link https://developer.twitter.com/en/docs/api-reference-index Twitter API Reference Index}
 * * For Streaming endpoints, see {@link https://developer.twitter.com/en/docs/tweets/filter-realtime/overview Filter Realtime Tweets}
 *
 * @param {function} [options.twitter.stream=function(err, data){}] callback function on a stream 'data' event for the returned {@link  https://www.npmjs.com/package/twitter#streaming-api Twitter stream}.
 *
 * * `err` is the {@link Error} object (unused in this case)
 * * `data` is in the form of `{twitter: {stream: stream, tweets: Object}}`
 * * `data.twitter.stream` is the {@link https://www.npmjs.com/package/twitter#streaming-api twitter stream}
 * * `data.twitter.tweets` are  the {@link https://www.npmjs.com/package/twitter tweets} in JSON format
 *
 * @param {Object} [options.twitter.connection={}] Twitter API connection credentials:  
 *
 * 1. Login at {@link https://apps.twitter.com/}
 * 2. Create a {@link https://apps.twitter.com/app/new new application}
 * 3. Go to your {@link https://apps.twitter.com/ applications}
 * 4. Click on your created application
 * 5. Click on **Keys and Access Tokens**
 * 6. Keep note of the following:
 *
 * * **Consumer Key (API Key)**
 * * **Consumer Secret (API Secret)**
 * * **Access Token**
 * * **Access Token Secret**
 *
 * @param {string} [options.twitter.connection.consumer_key=process.env.TWITTER_CONSUMER_KEY] Twitter API **Consumer Key (API Key)**.
 * @param {string} [options.twitter.connection.consumer_secret=process.env.TWITTER_CONSUMER_SECRET] Twitter API **Consumer Secret (API Secret)**.
 * @param {string} [options.twitter.connection.access_token_key=process.env.TWITTER_ACCESS_TOKEN_KEY] Twitter API **Access Token Key**.
 * @param {string} [options.twitter.connection.access_token_secret=process.env.TWITTER_ACCESS_TOKEN_SECRET] Twitter API **Access Token Secret**.
 * @param {string} [options.twitter.connection.bearer_token=process.env.TWITTER_BEARER_TOKEN] Twitter API **Bearer Token**.
 * @param {string} [options.jsonata=process.env.JSONATA] {@link https://www.npmjs.com/package/jsonata jsonata} query for the received tweet object in JSON format before returning the tweet data.
 * 
 * @returns {(Promise|stream)} Returns a stream if `options.twitter.method` is 'stream', otherwise returns a Promise:
 *
 * **If `options.twitter.method` == `'stream'`** 
 *
 * * Return a {@link https://www.npmjs.com/package/twitter#streaming-api Twitter stream}  
 * * `stream.on('data', function)`: calls `function` when a tweet is available  
 * * `stream.on('error', function)`: calls `function` when there is an error  
 *
 * **Else** 
 * 
 * * Return a {@link Promise} object that resolves a `data` object in the form `{twitter: {client: ..., tweets: ...}}`  
 *
 * * `data.twitter.client`: contains a {@link https://www.npmjs.com/package/twitter Twitter client} object created from `options.twitter.connection`  
 * * `data.twitter.tweets`: contains the {@link https://www.npmjs.com/package/twitter tweets} in JSON format
 *
 * @example
 * var twitter2return = require('twitter2return');
 *
 * // (options) Initialize options object
 * var options = {twitter: {}};
 *
 * // *** CONNECTION SETUP ***
 * 
 * // (options_twitter_connection) Twitter API connection keys
 * options.twitter.connection =  {
 * 	consumer_key: '***', // process.env.TWITTER_CONSUMER_KEY
 * 	consumer_secret: '***', // process.env.TWITTER_CONSUMER_SECRET
 * 	access_token_key: '***', // process.env.TWITTER_ACCESS_TOKEN_KEY
 * 	access_token_secret: '***' // process.env.TWITTER_ACCESS_TOKEN_SECRET
 * };
 *
 * // *** SEARCH TWEETS ***
 *
 * // (options_twitter_rest) Search for keyword 'twitter' in path 'GET search/tweets'
 * options.twitter.method = 'get'; // get, post, or stream
 * options.twitter.path = 'search/tweets'; // api path
 * options.twitter.params = {q: 'twitter'}; // query tweets
 *
 * // (options_jsonata) Filter for statuses array using jsonata
 * options.jsonata = 'statuses';
 * 
 * // (twitter2return_rest) Query tweets using REST API
 * twitter2return(options)
 * 	.then(data => {
 * 		console.log(data);
 * 	}).catch(err => {
 * 		console.error(err.message);
 * 	});
 *
 * // *** STREAM TWEETS ***
 *
 * // (options_twitter_connection) Track keyword 'twitter' in path 'POST statuses/filter'
 * options.twitter.method = 'stream'; // get, post, or stream
 * options.twitter.path = 'statuses/filter'; // api path
 * options.twitter.params = {track: 'twitter'}; // query tweets
 *
 * // (options_jsonata) Remove jsonata filter
 * delete options.jsonata;
 * 
 * // (options_twitter_stream) Log the tweets when received
 * options.twitter.stream = function(err, data) {
 * 	if (err) {console.error(err)};
 * 	console.log(data.twitter.tweets);
 * };
 * 
 * // (twitter2return_stream) Stream tweets
 * var stream = twitter2return(options);
 * stream.on('error', function(error) {
 * 	console.error(error.message);
 * });
 * 
 */
module.exports = options => {
	options = options || {};
	options.jsonata = options.jsonata || process.env.JSONATA;
	
	// (twitter_defaults) Default options for twitter
	options.twitter = options.twitter || {};
	options.twitter.method = options.twitter.method || process.env.TWITTER_METHOD || 'get';
	options.twitter.path = options.twitter.path || process.env.TWITTER_PATH || 'search/tweets';
	options.twitter.params = options.twitter.params || process.env.TWITTER_PARAMS || {q:'twitter'};
	options.twitter.stream = options.twitter.stream || function(err, data){};
	if (typeof options.twitter.params == 'string') {
		options.twitter.params = JSON.parse(options.twitter.params);
	}
	
	// (twitter_connect) Connection options for twitter
	options.twitter.connection = options.twitter.connection || {};
	options.twitter.connection.consumer_key = options.twitter.connection.consumer_key || process.env.TWITTER_CONSUMER_KEY;
	options.twitter.connection.consumer_secret = options.twitter.connection.consumer_secret || process.env.TWITTER_CONSUMER_SECRET;
	options.twitter.connection.access_token_key = options.twitter.connection.access_token_key || process.env.TWITTER_ACCESS_TOKEN_KEY;
	options.twitter.connection.access_token_secret = options.twitter.connection.access_token_secret || process.env.TWITTER_ACCESS_TOKEN_SECRET;
	options.twitter.connection.bearer_token = options.twitter.connection.bearer_token || process.env.TWITTER_BEARER_TOKEN;
	var client = new Twitter(options.twitter.connection);
	
	// (twitter_stream) Streaming API
	if (options.twitter.method == 'stream') {
		var stream = client[options.twitter.method](options.twitter.path, options.twitter.params);
		stream.on('data', function(tweets) {
			
			// (twitter_stream_jsonata) Filter tweets using jsonata syntax
			if (options.jsonata) {
				tweets = jsonata(options.jsonata).evaluate(tweets);
			}
			
			// (twitter_stream_cb) Pass stream and tweets to callback
			var data = {twitter: {stream: stream, tweets: tweets}};
			options.twitter.stream(undefined, data);
		});
		return stream;
	} else {
		
		// (twitter_rest) REST API
		return client[options.twitter.method](options.twitter.path, options.twitter.params)
			.then(tweets => {
				
				// (twitter_rest_jsonata) Filter tweets using jsonata syntax
				if (options.jsonata) {
					tweets = jsonata(options.jsonata).evaluate(tweets);
				}
				
				// (twitter_rest_promise) Pass client and tweets to promise
				return {twitter: {client: client, tweets: tweets}};
			});
	}
};
