var Parser = require('rss-parser');
var parser = new Parser();
var request = require('request');
var exchangeModel = require('../models_v2/exchange.js');
var Currencymodel = require('../models_v2/currency.js');
var _ = require('underscore');
var socket=require('socket.io-client')('http://localhost:9000',{path: '/ck/socket.io'});
var express =require('express');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var router=express.Router();
setInterval(function(){
        exchangeModel.find({status:1},{_id:0,totalVolume:1,markets:1,name:1},function(err,data){
            //console.log("test1"+data.length)
            socket.emit('exchanges',data)  
          })
      },1000)

	router.get('/',async function(req,res) {
  var limit = 2076
  if(req.query && req.query.page)
      limit = 100 * req.query.page
var sort = {'quotes.USD.market_cap': -1}
    console.log('apicall')
  setInterval(async function(){
   var data =  await Currencymodel.find({}).sort(sort).skip(limit - 100).limit(100)
    console.log('apifinish')
   if(data && data.length >0 )
      socket.emit('test',data)
     //res.send(data)
     else
     res.send([])
},1000)
})

  setInterval(async function(){
   var sort = {'quotes.USD.market_cap': -1}
    var data =  await Currencymodel.find({},{id:0,_id:0,rank:0,__v:0}).sort(sort)
    if(data && data.length >0 )
        socket.emit('allcurrency',data)
        // res.send(data)
    else
        res.send(["error:Coin not found"])

  },1000)
  


// setInterval(function(){
// router.get('/',async function(req,res) {
//     var sort = {'quotes.USD.market_cap': -1}
//     var data =  await Currencymodel.find({},{id:0,_id:0,rank:0,__v:0}).sort(sort)
//     if(data && data.length >0 )
//         socket.emit('allcurrency',data)
//         // res.send(data)
//     else
//         res.send(["error:Coin not found"])
// })

// },1000)
module.exports = router