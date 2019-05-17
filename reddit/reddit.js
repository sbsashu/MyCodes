 var Snooper = require('reddit-snooper')
    snooper = new Snooper(
        {
            // credential information is not needed for snooper.watcher
            username: 'surajcrypto',
            password: 'suraj@12345',
            app_id:'2BazfLfcGEKrgw',
            api_secret:'SqredxuMV_aSPLSWM1lrGXrpiLQ',
          //  user_agent: 'OPTIONAL user agent for your bot',

          automatic_retries: true, // automatically handles condition when reddit says 'you are doing this too much'
          api_requests_per_minuite: 60 // api requests will be spread out in order to play nicely with Reddit
        })
        snooper.api.get('/user/asdsd/about', {}, function(err, statusCode, data) {
            var  sub=data.data.children
            // for(var i=0; i<=sub.length; i++){
            //   console.log(sub[i].data.display_name)
            // }
            console.log(data)
        //    console.log(data.data[0].comment_karma);
           console.log(sub)
            //console.log(JSON.stringify(data))
            //console.log(data.data.children);
          //  console.log(data.data.children);
        })
//         // snooper.api.get_token(function(err, token) {
//         //     console.log(token)
//         // })
        // const redditjs = require('redditwrap.js')
        // let reddit = new redditjs({
        // //  useragent: USERAGENT,
        //   username: 'surajcrypto',
        //   password: 'suraj@12345',
        //   clientID: '2BazfLfcGEKrgw',
        //   clientSecret: 'SqredxuMV_aSPLSWM1lrGXrpiLQ'
        // })
        // reddit.on('ready', () =>{
        //   reddit.getUser('himanshu')
        //     .then(data =>{
        //       console.log(data)
        //     })
        //     .catch(err => {
        //       console.log(err)
        //     })
        // })
