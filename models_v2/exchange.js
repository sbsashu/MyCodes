'use strict';
const mongoose = require('mongoose');
var exchangeSchema = mongoose.Schema({
    uid : {
        type : String,
        unique : true,
    },
    name : String,
    country : [],
    created_at:Date,
    logo : String,
    webUrl : String,
    status:Number,
    totalVolume:Number,
    markets:Number,
    last_updated:Date,
    apiurl:String,
    currencyapiurl:String
});

const MyModel = mongoose.model('Exchange', exchangeSchema);
module.exports = MyModel;