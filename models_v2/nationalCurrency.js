'use strict';
const mongoose = require('mongoose');
var nationalCurrencySchema = mongoose.Schema({
    symbol : {
        type : String,
        unique:true
    },
    usdValue:{
        type : Number
    },
    last_updated:String
});

const nationalCurrencyModel = mongoose.model('nationalCurrency', nationalCurrencySchema);
module.exports = nationalCurrencyModel;