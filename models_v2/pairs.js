'use strict';
const mongoose = require('mongoose');
var pairsSchema = mongoose.Schema({
    name : {
        type : String,
    },
    exchangeId :String,
    basecoin:String,
    quotecoin:String,
    symbol:String,
    tickerData:{},
    created_at:Date
});

const pairsModel = mongoose.model('Pairs', pairsSchema);
module.exports = pairsModel;

