var Currencymodel = require('../models/currency.js');
var updatedPairs = require('../models/updatedPairs.js');
var pairmodel = require('../models/pairs.js');
var exchangeModel = require('../models/exchange.js');
var RssLinkModel = require('../models/rsslinks.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var _ = require('underscore');
var FetchfeedModel = require('../models/feed.js');
var express = require('express');
var router = express.Router();
var moment = require('moment')





router.get('/getCurrenciesByCoin',async function(req,res) {
  if(!req.query.base || req.query.base == ''){
      res.send([])
  }
  else
    {
      var reg = "^"+req.query.base 
       reg = new RegExp(reg,'i')

       var currentlyWorkingExchange =[{  exchangeId : "zecoex" } , {  exchangeId : "poloniex" },{  exchangeId : "hitbtc" },{  exchangeId : "binance" },{  exchangeId : "cointiger" },{  exchangeId : "kuna" },{  exchangeId : "coinbene" }]

       var data = await  updatedPairs.aggregate([
                  { $match: { $and: [ {symbol: { $regex: reg } }, { $or : currentlyWorkingExchange } ] }},
                   // {"$match":{ symbol: { $regex: reg } }},
                       {
                         $project:
                          {
                             symbol: 1,
                             exchangeId:1,
                             usdbasevolume:1,
                             ticker: { $arrayElemAt: [ "$tickerData", -1 ] }
                          }
                       }
                    ])
       if(data && data.length > 0) {
         res.send(data)
       }
    }

});

router.get('/getExchangelist',async function(req,res) {

  
   var data =  await exchangeModel.find({status: 1,totalVolume:{$exists:true},totalVolume:{$gt:0}}).sort({totalVolume: -1})
   //data = _.reject(data,function(da){return da.uid == 'kuna' || da.uid == 'zecoex' })
   if(data && data.length >0 )
     res.send(data)
     else
     res.send([])

})

router.get('/redit',async function(req,res) {

    var start   = Number(req.query.from)
    var end     = Number(req.query.end)
      var data =  await FetchfeedModel.find({generator:/.*www.reddit.com.*/}).sort({"isoDate":-1}).skip(start).limit(end)
       if(data && data.length >0 )
         res.send(data)
         else
         res.send([])

})

    router.get('/medium',async function(req,res) {

      var start   = Number(req.query.from)
      var end     = Number(req.query.end)
          var data =  await FetchfeedModel.find({generator:/.*medium.*/}).sort({"isoDate":-1}).skip(start).limit(end)
           if(data && data.length >0 )
             res.send(data)
             else
             res.send([])

    })

    router.get('/mediumDapp',async function(req,res) {

      var start   = Number(req.query.from)
      var end     = Number(req.query.end)
          var dapp = req.query.dapp
          var data =  await FetchfeedModel.find({generator:/.*medium.*/,related:dapp}).sort({"isoDate":-1}).skip(start).limit(end)
           if(data && data.length >0 )
             res.send(data)
             else
             res.send([])

    })

    router.get('/youtube',async function(req,res) {
      var start   = Number(req.query.from)
      var end     = Number(req.query.end)

          var data =  await FetchfeedModel.find({generator:/.*youtube.*/}).sort({"isoDate":-1}).skip(start).limit(end)
           if(data && data.length >0 )
             res.send(data)
             else
             res.send([])

    })

//feeds with limit
  router.get('/getFeedLimit',async function(req,res) {

    var condtion ={}
    var start   = Number(req.query.from)
    var end     = Number(req.query.end)

  
     if(req.query.cat) {
       var reg = ".*"+req.query.cat+".*"
      reg = new RegExp(reg)
      condtion = {category:reg}
     }


     var data =  await FetchfeedModel.find(condtion).sort({"isoDate":-1}).skip(start).limit(end)

     if(data) {
        res.send(data)  
     } else
       res.send([])  
  })


  router.get('/getFeed',async function(req,res) {

    var condtion ={}
  
     if(req.query.cat) {
       var reg = ".*"+req.query.cat+".*"
      reg = new RegExp(reg)
      condtion = {category:reg}
     }


     var data =  await FetchfeedModel.find(condtion).sort({"isoDate":-1}).limit(100)

     if(data) {
        res.send(data)  
     } else
       res.send([])  
  })

router.get('/getPairsList',async function(req,res) {

    var coin = req.query.coin || "Litecoin"

   var data = await updatedPairs.find({baseSymbolName:coin},{tickerData:0})
   var data = await exchangeModel.find({baseSymbolName:coin},{tickerData:0})
   if(data && data.length >0 )
     res.send(data)
     else
     res.send([])

})


router.get('/getExchangeDetail',async function(req,res) {

    var ex = req.query.ex
    if(ex){
       var data = await exchangeModel.findOne({uid:ex})
       if(data)
         res.send(data)
         else
         res.send(null)
    }else
    res.send(null)
})


router.get('/getCurrencies',async function(req,res) {

    

  var limit = 2076

  if(req.query && req.query.page)
      limit = 100 * req.query.page


var sort = {'quotes.USD.market_cap': -1}

    console.log('apicall')
   var data =  await Currencymodel.find({}).sort(sort).skip(limit - 100).limit(100)
    console.log('apifinish')
   if(data && data.length >0 )
     res.send(data)
     else
     res.send([])

})

router.get('/getCurrenciesDatass',async function(req,res) {
  var sort = {'rank': 1}
   var data =  await Currencymodel.find({},{_id:0}).sort(sort)
    //console.log('apifinish')
   if(data && data.length >0 )
     res.send(data)
     else
     res.send([])
})

router.get('/toprankCurrencies',async function(req,res) {

   var data =  await Currencymodel.find({}).sort({rank: 1}).limit(5)
   if(data && data.length >0 )
     res.send(data)
     else
     res.send([])

})

router.get('/getGainers',async function(req,res) {

    var top = Number(req.query.losser) || -1
    var type = req.query.time || '24Hour'
    var amount = req.query.minamount || 50000

    var sort = {"quotes.USD.percent_change_24h": top}

    if(type == '1Hour')
      sort = {"quotes.USD.percent_change_1h": top}
    else if(type == '7Day')
      sort = {"quotes.USD.percent_change_7d": top}
    else
      sort = {"quotes.USD.percent_change_24h": top}


   var data =  await Currencymodel.find({"quotes.USD.volume_24h": { $gt: Number(amount) }}).sort(sort).limit(30)
   if( data && data.length >0 )
     res.send(data)
     else
     res.send([])

})



router.get('/exchangePairs',async function(req,res) {
      var exchange = req.query.exchange  || 'binance'
        
      try {

            var data =  await updatedPairs.find({
                  exchangeId: exchange   
                })

            if(data && data.length > 0)
                {
                var dataToSend = []   
                _.each(data,function(currobj) {
                  var newPro =  _.find(currobj.tickerData,function(tick){
                      if(tick) {
                        if( new Date(moment(tick.time)).getMonth() == new Date(moment.utc().subtract(1,"hours")).getMonth()  &&    new Date(moment(tick.time)).getDate() == new Date(moment.utc().subtract(24,"hours")).getDate()  && new Date(moment(tick.time)).getHours() == new Date(moment.utc().subtract(24,"hours")).getHours()  )
                          return true
                        else
                          return false
                      }
                      else
                        return false
                    })
                    var newTicker =null
                    if(newPro)
                       newTicker = newPro.ticker

                    currobj._doc.percentVolume = calculateVolume(currobj.tickerData[currobj.tickerData.length - 1].ticker, newTicker)
                    currobj._doc.tickerData = currobj.tickerData[currobj.tickerData.length - 1].ticker

                    dataToSend.push(currobj)
                  })
                 dataToSend = _.sortBy(dataToSend, function(lastesfeed) {return lastesfeed.usdbasevolume}).reverse()

                 res.send(dataToSend) 
        }
        else {
          res.send([])
        }

        } catch(err) {
               console.log(err)
      }


})


// router.get('/exchangePairs',async function(req,res) {

//   console.log('start')

//    var AllPromises = []
//             var data =  await updatedPairs.find({
//                   exchangeId: 'binance'    
//                 })
//             console.log('1st step')
//             try{
//               _.each(data,async function(currobj) {
//                 var promise = new Promise(async function(resolve, reject) {

//                   var oldOne = await pairmodel.findOne({
//                     exchangeId: 'binance',
//                     symbol:currobj.symbol
//                   },
//                   {_id: 0, 'tickerData': 1},
//                   {"$gte": new Date(moment.utc().subtract(24,"hours").format("YYYY-MM-DD HH:mm Z"))}
//                   )
//                   console.log('5th step')
//                  // console.log(oldOne._doc)
//                   currobj._doc.Prcentvolume = calculateVolume(currobj.tickerData,oldOne.tickerData)
//                   resolve(currobj)
//                 });

//               AllPromises.push(promise) 
//               console.log(promise)    
//             })
//             }catch(err){
//               console.log(err)
//             }
//               console.log('2nd step')
//           Promise.all(AllPromises.splice(0)).then(function(results) {
//             console.log('4rd step')
//             res.send(results)
//           }).catch(err){
//             console.log(err)
//           }


// })

// function calculateVolume(newTick,oldTick) {
//     var Changesprcent = ((newTick.baseVolume - oldTick.baseVolume)/oldTick.baseVolume) * 100
//       return Changesprcent
//     }

  function calculateVolume(newTick,oldTick) {

      if(!oldTick)
        return 0
        
        var Changesprcent = ((newTick.baseVolume - oldTick.baseVolume)/oldTick.baseVolume) * 100
          return Changesprcent
      
      
        }



module.exports = router