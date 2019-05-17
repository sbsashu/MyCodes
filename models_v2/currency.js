'use strict';
const mongoose = require('mongoose');
var currencySchema = mongoose.Schema({
    id:Number,
    name : {
        type : String,
        unique:true
    },
    rank:Number,
    symbol:{
        type : String
    },
    website_slug:{
        type : String
    },
    circulating_supply:{
        type : Number
    },
    total_supply:{
        type : Number
    },
    ckprice:{
        type : Number
    },
    max_supply:{
        type : Number
    },
    quotes:{ },
    last_updated:String,
    ckupdated:Date
});

const currencyModel = mongoose.model('Currency', currencySchema);
module.exports = currencyModel;