var Mongo=require('mongodb').MongoClient;
const  TwitterClient = require('easy-twitter');
//_Create a new Twitter app and get the keys needed
const twitter = new TwitterClient({consumer_key: "qOxCMwf78b32nFhQZIbMV4hfa",
                                 consumer_secret: "QJU92WduP6xO23P6x3Ou5eN8MTYlzgjwl9Mc06JdPfpZPUHA74",
                                 access_token_key: "1085876219214790656-WerdyCAiN5YOVUd3ooUSToqHUvq78L",
                                 access_token_secret : "gDh9qACvfW3McBTGB7nmjvdIrJbPIada6Q7SJ6ELePvpU"});
const twitterAccount = '@Ashutos83977501';
const count = 12;
var express=require('express');
var app=express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// using promise
 //Mongo.connect('mongodb://localhost:27017/test/data',function(err,db){
   app.get('/',function(req,res){
   twitter.getFollowersList(twitterAccount, count)
       .then(data => {
           var data=data.followers;
           console.log(data)
           app.post('/', function(req,res){
             res.send(data);
             console.log(req.body.username);
             for(var i=0; i<=data.length; i++){
              if(data[i]===req.body.username){
              console.log('user is  follower'+data[i])
            }
             }
           })
         //
         //   for(var i=0; i<=data.length; i++){
         //   if(data[i]=req.params){
         //   console.log('user request'+data.length);
         // }else{
         // twitter.getFollowersList(twitterAccount,count,function(data){
         //       data.push(data);
         // })
         // }
         // }



           //res.send("Follower List :"+data.followers);

           //console.log(data.fullInfos);
           // data.followers : Array of the followers name ( 12 followers because count = 12)
           // data.fullInfos : More infos below
           // data.user : 'iAmAlphaZz' in this case
       })
       .catch(err => {
           console.error(err.error);
       });

   })
 //})
app.listen(3000,function(){
    console.log('Listening Port 3000')
})
