var Currencymodel     = require('../models_v2/currency.js');
var updatedPairs      = require('../models_v2/updatedPairs.js');
var pairmodel         = require('../models_v2/pairs.js');
var exchangeModel     = require('../models_v2/exchange.js');
var dappsvolumeModel  = require('../models_v2/dappsvolume.js');
var exchangeVolumeModel = require('../models_v2/exchangeVolume.js');
var currencyPairsVolume = require('../models_v2/currencyPairsVolume.js');
var exchangeVolumeModel = require('../models_v2/exchangeVolume.js');
var async             = require('asyncawait/async');
var await             = require('asyncawait/await');
var _                 = require('underscore');
//var FetchfeedModel = require('../models/feed.js');
var express           = require('express');
var router            = express.Router();
var moment            = require('moment')
var strtotime = require('nodestrtotime');
var socket=require('socket.io-client')('http://localhost:9000');

router.get('/hello',async function(req,res) {
    res.send([{"msg":"Welcome to cryptoknowmics api v2"}])
})


// All Exchange list
router.get('/getExchangelist',async function(req,res) {

    var data =  await exchangeModel.find(
        {status: 1, totalVolume:{$exists:true}, totalVolume:{$gt:0}},
        {name:1, uid:1, totalVolume:1, last_updated:1, markets:1, _id:0}
    ).sort({totalVolume: -1})

    //data = _.reject(data,function(da){return da.uid == 'kuna' || da.uid == 'Cryptoknowmics' })
    if(data && data.length >0 )
        res.send(data)
    else
        res.send([])
})

router.get('/getTOPExchangelist',async function(req,res) {

    var data =  await exchangeModel.find(
        {status: 1, totalVolume:{$exists:true}, totalVolume:{$gt:0}},
        {name:1, uid:1, totalVolume:1, last_updated:1, markets:1, _id:0}
    ).sort({totalVolume: -1}).limit(5)

    //data = _.reject(data,function(da){return da.uid == 'kuna' || da.uid == 'Cryptoknowmics' })
    if(data && data.length >0 )
        res.send(data)
    else
        res.send([])
})


router.get('/getExchangeDetail',async function(req,res) {

    var ex = req.query.exchange
    if(ex){
        var data = await exchangeModel.findOne({uid:ex},{country:0, _id:0, logo:0, apiurl:0, currencyapiurl:0})
        if(data)
            res.send(data)
        else
            res.send(null)
    }else
        res.send(null)
})

router.get('/exchangePairs',async function(req,res) {

    if(req.query.exchange){
        var exchange = req.query.exchange
        var data = await updatedPairs.aggregate([
                                                    {
                                                        "$match": {
                                                            exchangeId:exchange,
                                                            usdbasevolume:{$gt:0},
                                                            $or: [{ "tickerData.isFrozen": '0' }, { "tickerData.isFrozen": 0 }]
                                                        }
                                                    },
                                                    {   "$project":{
                                                            _id:0, usdbasevolume:1, name:1, baseCoinName:1, quoteCoinName:1, basecoin:1, quotecoin:1, usdhigh:1, usdlow:1, usdprice:1, percentChange:"$tickerData.percentChange"
                                                        }
                                                    },
                                                    {
                                                        $sort : { usdbasevolume : -1} }
                                                ])
        if(data.length>0){
            res.send(data)
        }
    }else{
        res.send([{"error":"exchange name is missing"}])
    }

})

// Currency list getCurrencies?page=1 than return 100 data

  router.get('/getCurrencies',async function(req,res) {
    var limit = 2300
    if(req.query && req.query.page){
      limit = 100 * req.query.page
    }
    var sort = {'quotes.USD.market_cap': -1}
    var data =  await Currencymodel.find({},{id:0,_id:0,rank:0,__v:0}).sort(sort).skip(limit - 100).limit(100)
    if(data && data.length >0 )
        socket.emit('currency',data)
        // res.send(data)
    else
        res.send([])
})


// Currency list getCurrencies?page=1 than return 100 data
router.get('/getallCurrencies',async function(req,res) {
    var sort = {'quotes.USD.market_cap': -1}
    var data =  await Currencymodel.find({},{id:0,_id:0,rank:0,__v:0}).sort(sort)
    if(data && data.length >0 )
        socket.emit('allcurrency',data)
        // res.send(data)
    else
        res.send(["error:Coin not found"])
})



// Top currency Market cap 
router.get('/toprankCurrencies',async function(req,res) {

   var data =  await Currencymodel.find({},{id:0,_id:0,rank:0,__v:0}).sort({'quotes.USD.market_cap': -1}).limit(5)
   if(data && data.length >0 )
     res.send(data)
     else
     res.send([])

})

// find currency name
router.get('/findCurrencies',async function(req,res) {

      var symbol = req.query.coin.toUpperCase();
  
  const capitalize = (s) => {
                              if (typeof s !== 'string') return ''
                              return s.charAt(0).toUpperCase() + s.slice(1)
                            }
      
      var name   = capitalize(req.query.coin)

      if(req.query.coin){
         var toSearch = symbol.split(" ").map(function(n) {
                                                              return {  
                                                                  symbol: new RegExp('^'+n.trim()+'', 'm')
                                                              }
                                                          });
         var toSearcname = name.split(" ").map(function(n) {
                                                              return {  
                                                                  name: new RegExp('^'+n.trim()+'', 'm')
                                                                 }
                                                            });

    var data =  await Currencymodel.find({$and: toSearch}).sort({'quotes.USD.market_cap': 1})
    if(data && data.length >0 ){

                                  res.send(data)
                                }
        
    else{
           var data =  await Currencymodel.find({$and: toSearcname}).sort({'quotes.USD.market_cap': 1})
            
            if(data && data.length >0 ){
             
             res.send(data)

            }else{

              res.send(["error:Coin not found"])
            }
        }
        
      }else{

         res.send(["error:Coin name missing"])


      }
})

//charting 

//history
router.get('/history',async function(req,res) {

      var symbol     = req.query.symbol;
      var resolution     = req.query.resolution
      var from     = req.query.from
      var to     = req.query.to

     const periods = resolution; //time intervals to process data
     const startDate = new Date(moment.unix(from))
     const endDate =  new Date(moment.unix(to))

     console.log(startDate);

      var exchangeVolume =  await currencyPairsVolume.aggregate([

      {$unwind:"$totalVolume"},
      {
        $match:{
              symbol:symbol,

        }
      },
      {
      $group: {
        
        _id: {
            
          $add: [
            { $subtract: [
              { $subtract: [ "$totalVolume.at", new Date(0) ] },
              { $mod: [
                { $subtract: [ "$totalVolume.at",endDate ] },
                1000 * 60 * periods
            ]}
              
          ]}, {$millisecond:new Date(0)}],
            
          },
        o: {$first: "$totalVolume.usdPrice"},
        c: {$last: "$totalVolume.usdPrice"},
        h: {$max: "$totalVolume.usdPrice"},
        l: {$min: "$totalVolume.usdPrice"},
        }
      },
        {
          $project: {
            _id: 0,t:{$divide:["$_id",1000]}, o: 1, c:1, h:1,l:1,s:'ok',
          }
        },{ $sort: { t : -1 } }
      ])

       if(exchangeVolume.length > 0 ){

        var time = [];
        var open = [];
        var close = [];
        var high = [];
        var low = [];

        for (var i = exchangeVolume.length - 1; i >= 0; i--) {


            time.push(exchangeVolume[i].t);
            open.push(exchangeVolume[i].o);
            close.push(exchangeVolume[i].c);
            high.push(exchangeVolume[i].h);
            low.push(exchangeVolume[i].l);

          

          
        } 
            res.send({t:time,o:open,c:close,h:high,l:low,s:'ok'})
        
       }else{
                res.send([{"s":"no_data"}])

       }

        
     
})

//config

router.get('/config',async function(req,res) {

        res.send('{"supports_search":true,"supports_group_request":false,"supports_marks":true,"supports_timescale_marks":true,"supports_time":true,"exchanges":[{"value":"","name":"All Exchanges","desc":""},{"value":"Cryptoknowmics","name":"Cryptoknowmics","desc":"Cryptoknowmics"},{"value":"BTC","name":"BTC","desc":"BTC"},{"value":"NCM","name":"Cryptoknowmics","desc":"NCM"},{"value":"Cryptoknowmics","name":"Cryptoknowmics","desc":"Cryptoknowmics"}],"symbols_types":[{"name":"All types","value":""},{"name":"Stock","value":"stock"},{"name":"Index","value":"index"}],"supported_resolutions":["1","5","15","30","60","120"]}') 
})

//marks

/*router.get('/marks',async function(req,res) {

var today  = new Date(moment.getTime())
var fourday  = new Date(moment.utc().add(-4, 'day'))
var sevenday   = new Date(moment.utc().add(-7, 'day'))
var fifteenday   = new Date(moment.utc().add(-15, 'day')) 
var thertyday  = new Date(moment.utc().add(-30, 'day'))
 
res.send('{"id":[0,1,2,3,4],"time":['+today+','+fourday+','+sevenday+','+fifteenday+','+thertyday+'],"color":["red","blue","green","blue","green"],"text":["Today","4 days back","7 days back","15 days back","30 days back"], "label":["A","B","CORE","INR","F"], "labelFontColor":["white","white","red","white","#000"], "minSize":[14,28,7,7,14]}') 
})*/

// symbol

router.get('/symbols',async function(req,res) {

   var symbol     = req.query.symbol

        res.send('{"name":"'+symbol+'","exchange-traded":"CRYPTOKNOWMICS","exchange-listed":"CRYPTOKNOWMICS","timezone":"(UTC+8)singapore","minmov":10,"minmov2":0,"pointvalue":1,"session":"24x7","has_intraday":true,"has_no_volume":false,"description":"CRYPTOKNOWMICS","type":"stock","supported_resolutions":["1","5","15","30","60","120"],"pricescale":10000,"has-dwm":false,"ticker":"'+symbol+'"}') 
})

// symbol info


router.get('/symbols_info',async function(req,res) {

   var symbol     = req.query.symbol

        res.send( '{symbol: ["CRYPTOKNOWMICS"],description: ["CRYPTOKNOWMICS", "CRYPTOKNOWMICS", "S&P 500 index"],exchange-listed: "CRYPTOKNOWMICS",exchange-traded: "CRYPTOKNOWMICS",minmovement: 1, minmovement2: 0,pricescale: [1, 1, 100],has-dwm: true,has-intraday: true,has-no-volume: [false, false, true],type: ["stock", "stock", "index"],ticker: ["'+symbol+'", "'+symbol+'", "'+symbol+'"],timezone: "Asia/Kolkata",session-regular: "0900-1600"}') 
})


 
//time
router.get('/time',async function(req,res) {

        res.send('[{"id":"tsm1","time":1532995200,"color":"red","label":"A","tooltip":""},{"id":"tsm2","time":1532649600,"color":"blue","label":"D","tooltip":["Dividends: $0.56","Date: Fri Jul 27 2018"]},{"id":"tsm3","time":1532390400,"color":"green","label":"D","tooltip":["Dividends: $3.46","Date: Tue Jul 24 2018"]},{"id":"tsm4","time":1531699200,"color":"#999999","label":"E","tooltip":["Earnings: $3.44","Estimate: $3.60"]},{"id":"tsm7","time":1530403200,"color":"red","label":"E","tooltip":["Earnings: $5.40","Estimate: $5.00"]}]') 
})
// Top Gainer Currencies

router.get('/getGainers',async function(req,res) {

    var top     = Number(req.query.losser) || -1
    var type    = req.query.time || '24Hour'
    var amount  = req.query.minamount || 50000
    var matchs  = {
                      "quotes.USD.volume_24h": { $gt: Number(amount) },
                      "quotes.USD.percent_change_24h": { $gt: Number(0) },
                      "quotes.USD.percent_change_24h": { $ne: null }
                  }

    var sort    = {"quotes.USD.percent_change_24h": top}

    if(type == '1Hour'){
      sort      = {"quotes.USD.percent_change_1h": top}
      matchs    = {
                      "quotes.USD.volume_24h": { $gt: Number(amount) },
                      "quotes.USD.percent_change_1h": { $gt: Number(0) },
                      "quotes.USD.percent_change_1h": { $ne: null }
                  }
    }        
    else if(type == '7Day'){
      sort = {"quotes.USD.percent_change_7d": top}
      matchs    = {
                      "quotes.USD.volume_24h": { $gt: Number(amount) },
                      "quotes.USD.percent_change_7d": { $gt: Number(0) },
                      "quotes.USD.percent_change_7d": { $ne: null }
                  }
    }        
    else{
      sort      = {"quotes.USD.percent_change_24h": top}
      matchs    = {
                      "quotes.USD.volume_24h": { $gt: Number(amount) },
                      "quotes.USD.percent_change_24h": { $gt: Number(0) },
                      "quotes.USD.percent_change_24h": { $ne: null }
                  }
    }
        

    var data =  await Currencymodel.aggregate([
        {
            "$match": matchs
        },
        {   "$project":{
                _id:0, __v:0, rank:0, ckupdated:0, ckprice:0
            }
        },
        {
            $sort : sort
        },
        { 
            $limit : 25 
        }
    ])
   // var data =  await Currencymodel.find({"quotes.USD.volume_24h": { $gt: Number(amount) }}).sort(sort).limit(25)
    if( data && data.length >0 )
        res.send(data)
    else
        res.send(["error:Coin not found"])

})


router.get('/dapp',async function(req,res) {
  var id = req.query.id
  if(id){
     var data = await dappsvolumeModel.find({id:id}).sort({"ISODate":-1})

    if(data && data.length >0 ){
       res.send(data)
    }else{
      res.send(["error:Coin not found"])
    }
  }else
    res.send([])
})



router.get('/currencyDetails',async function(req,res) {

    if(req.query.coin){
        var coin = req.query.coin
        var data = await updatedPairs.aggregate([{
                                                        "$match": {
                                                            quotecoin:coin,
                                                            usdbasevolume:{$gt:0},
                                                            $or: [{ "tickerData.isFrozen": '0' }, { "tickerData.isFrozen": 0 }]
                                                        }
                                                    },
                                                     {
                                                        $sort : { usdbasevolume : -1} }
                                                    ])

        if(data.length>0){
            res.send(data)
        }else{

          res.send([{"error":"not listed"}])
        }

    }
    else{
      
        res.send([{"error":"coin symbol is missing"}])
    }

})




router.get('/exchangelast24Volume',async function(req,res) {

 if(req.query.uid)
  {
      var uid = req.query.uid
      var last24Time      = new Date(moment.utc().add(-24, 'hours'))
      var data =  await exchangeVolumeModel.find( { uid: uid},{ "totalVolume": { $elemMatch: { "at": { $gt: last24Time } } } } )
     if(data.length>0){
            res.send(data)
        }else{

          res.send([{"error":"not listed"}])
        }
    }
    else{
      
        res.send([{"error":"Exchange name is missing"}])
    }
})

router.get('/exchange24Volume',async function(req,res) {

 if(req.query.uid)
  {
      var uid = req.query.uid
      var last24Time      = new Date(moment.utc().add(-24, 'hours'))
      var data =  await exchangeVolumeModel.find( { uid: uid} )
      if(data.length>0){
           
           const copy = [];

            for(var i = 0; i < (data[0].totalVolume.length); i++) { 

            if(data[0].totalVolume[i].at > last24Time){

              copy.push({"date":data[0].totalVolume[i].at,"value":data[0].totalVolume[i].usdVolume })

            }
           }
        res.send(copy)

        }else{

          res.send([{"error":"not listed"}])
        }
    }
    else{
      
        res.send([{"error":"Exchange name is missing"}])
    }
})

router.get('/currencyData',async function(req,res) {

	if(req.query.coin)
	{

		  var coin = req.query.coin.toUpperCase()
		  var last24Time      = new Date(moment.utc().add(-24, 'hours'))
		  var currTime      = new Date(moment.utc().add(-3, 'hours'))
		  var data1 =  await currencyPairsVolume.find( { symbol: coin},{ "totalVolume": { $elemMatch: { "at": { $gt: last24Time } } } } )
		  var data2 =  await currencyPairsVolume.find( { symbol: coin },{ "totalVolume": { $elemMatch: { "at": { $gt: currTime } } } } )
		  var children = data1[0].totalVolume.concat(data2[0].totalVolume);

        if(children.length>0){
            res.send(children)
        }else{

          res.send([{"error":"not listed"}])
        }
    }
    else{
      
        res.send([{"error":"coin symbol is missing"}])
    }
})





module.exports = router