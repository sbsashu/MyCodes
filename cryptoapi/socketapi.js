"use strict";
module.exports = function (io) {
let Parser = require('rss-parser');
let parser = new Parser();
var request = require('request');
var exchangeModel     = require('../models_v2/exchange.js');
var Currencymodel     = require('../models_v2/currency.js');
var _ = require('underscore');
var express           = require('express');
var router            = express.Router();
setInterval(function(){
        exchangeModel.find({status:1},{_id:0,totalVolume:1,markets:1,name:1},function(err,data){
            //console.log("test1"+data.length)
            io.emit('exchanges',data)  
          })
      },1000)
setInterval(function(){
	router.get('/currency',async function(req,res) {
  var limit = 2076
  if(req.query && req.query.page)
      limit = 100 * req.query.page
var sort = {'quotes.USD.market_cap': -1}
    console.log('apicall')
   var data =  await Currencymodel.find({}).sort(sort).skip(limit - 100).limit(100)
    console.log('apifinish')
   if(data && data.length >0 )
    io.emit('test',data)
     //res.send(data)
     else
     res.send([])
})
})

}