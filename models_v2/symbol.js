'use strict';
const mongoose = require('mongoose');
var symbolSchema = mongoose.Schema({
    id : {
        type : String,
    },
    exchangeId : String,
    baseCurrency: String,
    quoteCurrency: String,
    feeCurrency: String,
    symbol:String
});

const SymbolModel = mongoose.model('Symbol', symbolSchema);
module.exports = SymbolModel;