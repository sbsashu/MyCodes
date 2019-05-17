// Richard Wen
// rrwen.dev@gmail.com

require('dotenv').config();

// (packages) Package dependencies
var fs = require('fs');
var moment = require('moment');
var twitter2return = require('../index.js');
var test = require('tape');

// (test_info) Get package metadata
var json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var testedPackages = [];
for (var k in json.dependencies) {
	testedPackages.push(k + ' (' + json.dependencies[k] + ')');
}
var devPackages = [];
for (var k in json.devDependencies) {
	devPackages.push(k + ' (' + json.devDependencies[k] + ')');
}

// (test_log) Pipe tests to file and output
if (!fs.existsSync('./tests/log')){
	fs.mkdirSync('./tests/log');
}
var testFile = './tests/log/test_' + json.version.split('.').join('_') + '.txt';
test.createStream().pipe(fs.createWriteStream(testFile));
test.createStream().pipe(process.stdout);

// (test) Run tests
test('Tests for ' + json.name + ' (' + json.version + ')', t => {
	t.comment('Node.js (' + process.version + ')');
	t.comment('Description: ' + json.description);
	t.comment('Date: ' + moment().format('YYYY-MM-DD hh:mm:ss'));
	t.comment('Dependencies: ' + testedPackages.join(', '));
	t.comment('Developer: ' + devPackages.join(', '));
	
	options = {twitter: {}};
	
	// (test_rest) Search for keyword 'twitter' in path 'GET search/tweets'
	twitter2return(options)
		.then(data => {
			t.pass('(MAIN) REST GET search/tweets');
			
			// (test_rest_jsonata) Search for keyword 'twitter' in path 'GET search/tweets' with 'statuses' filter
			options.twitter.method = 'get';
			options.twitter.path = 'search/tweets';
			options.twitter.params = {q: 'twitter'};
			options.jsonata = 'statuses';
			return twitter2return(options)
				.then(data => {
					t.pass('(MAIN) REST GET search/tweets with statuses jsonata filter');
				}).catch(err => {
					t.fail('(MAIN) REST GET search/tweets  with statuses jsonata filter: ' + err.message);
				});
		}).then(data => {
			
			// (test_stream) Track keyword 'twitter' in path 'POST statuses/filter'
			options.twitter.method = 'stream';
			options.twitter.path = 'statuses/filter';
			options.twitter.params = '{"track": "twitter"}';
			options.twitter.stream = function(err, data) {
				if (err) {console.error(err)};
				t.pass('(MAIN) Stream POST statuses/tweets');
				
				// (test_stream_jsonata) Track keyword 'twitter' in path 'POST statuses/filter' with 'statuses' filter
				options.twitter.method = 'stream';
				options.twitter.path = 'statuses/filter';
				options.twitter.params = {track: 'twitter'};
				options.jsonata = 'statuses';
				options.twitter.stream = function(err, data) {
					if (err) {console.error(err)};
					t.pass('(MAIN) Stream POST statuses/tweets  with statuses jsonata filter');
					process.exit(0);
				};
				var stream = twitter2return(options);
				stream.on('error', function(error) {
					t.fail('(MAIN) Stream POST statuses/tweets  with statuses jsonata filter: ' + error.message);
					process.exit(1);
				});
			};
			var stream = twitter2return(options);
			stream.on('error', function(error) {
				t.fail('(MAIN) Stream POST statuses/tweets: ' + error.message);
				process.exit(1);
			});
		})
		.catch(err => {
			t.fail('(MAIN) REST GET search/tweets: ' + err.message);
		});
	t.end();
});
