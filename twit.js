// var Twit = require('twit')
 
// var T = new Twit({
//   consumer_key:         'gsQeNlBXS9mwjPeTwUA2mljYz',
//   consumer_secret:      '9wJgEjEewzWPpoFMVaqK36lcG3RJbQy2ymGL3PX4Xzfqpm7cK9',
//   access_token:         '1085876219214790656-59wB6VT9S8ze7sixJqfJ3JKp6FM0UP',
//   access_token_secret:  'xtwwFJmPV1kVR1wjGaRjMsvGVHnhvueTvLi8szcuGyTjE',
//   //timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
//   //strictSSL:            true,     // optional - requires SSL certificates to be valid.
// })
// T.get('followers/ids', { screen_name: '@Ashutos83977501' },  function (err, data, response) {
//   console.log(data)
// })

var getTwitterFollowers =require('get-twitter-followers');
var tokens={
	consumer_key:         'gsQeNlBXS9mwjPeTwUA2mljYz',
  consumer_secret:      '9wJgEjEewzWPpoFMVaqK36lcG3RJbQy2ymGL3PX4Xzfqpm7cK9',
  access_token:         '1085876219214790656-59wB6VT9S8ze7sixJqfJ3JKp6FM0UP',
  access_token_secret:  'xtwwFJmPV1kVR1wjGaRjMsvGVHnhvueTvLi8szcuGyTjE'
}
getTwitterFollowers(tokens, '@Ashutos83977501').then(followers => {
  console.log(followers[0].name); // "User Objects" array https://dev.twitter.com/overview/api/users
});