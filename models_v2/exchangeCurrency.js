'use strict';
const mongoose = require('mongoose');
var exchangeCurrencySchema = mongoose.Schema({
    exchangeId : String,
    symbol : String,
    name : String,
    last_updated:Date
});

const exchangeCurrencyModel = mongoose.model('exchangeCurrency', exchangeCurrencySchema);
module.exports = exchangeCurrencyModel;