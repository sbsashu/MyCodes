const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/newDb").then(
    (res) => {

        //init();

        //use only once

        //SaveAllCurrencies();
        //saveExchange();
        console.log("Connected to Database Successfully.")
    }
).catch((err) => {
    console.log("Conntection to database failed." ,err);
});


//mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });


var sahilApi = require('./cryptoapi/sahilApi.js');
var routeSocket=require('./cryptoapi/routesocket.js');

//Apies
//var ChartController = require('./chartapi/controller');


//console.log("modals success")

//Packages
var ccxt = require ('ccxt')
var request = require('request');
var https = require('https');
var express = require('express');
var _ = require('underscore');
var cors = require('cors')
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var bodyParser = require('body-parser')
var app = express();
var port = 9000

app.use(cors())
var server = require('http').createServer(app);  
var io = require('socket.io')(server,{path: '/ck/socket.io'});
server.listen(port); 

// io.on('connection', function(client){
//   console.log('Connected')
//       client.on('event', function(data){
//         console.log(data)
//       });
//       client.on('exchanges',function(data){
//         console.log(data);
//       })
//       client.on('disconnect', function(err){
//         console.log(err)
//       });
//   });
io.on('connection',function(socket){
  console.log(socket.id);
  socket.on('test',function(data){
    console.log("currency"+data.length)
  })
  socket.on('exchanges',function(data){
    console.log(data.length)
  })
  socket.on('allcurrency',function(data){
    console.log("Allcurrency"+data.length)
  })
})
// require('./cryptoapi/socketapi.js')(io)

app.use('/ck/v2/',sahilApi)
app.use('/ck/socket.io',routeSocket);
app.get('/ck', function(req,res) {
    //var CountData = await pairmodel.count()
    res.send('hii')
})


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  


