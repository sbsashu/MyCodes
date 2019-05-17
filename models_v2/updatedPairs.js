'use strict';
const mongoose = require('mongoose');
var updatedPairsSchema = mongoose.Schema({
    name            :   { type : String },
    exchangeId      :   String,
    basecoin        :   String,
    quotecoin       :   String,
    baseCoinName    :   String,
    quoteCoinName   :   String,
    symbol          :   String,
    tickerData      :   {},
    updated_at      :   Date,
    usdbasevolume   :   Number,
    usdprice        :   Number,
    usdhigh         :   Number,
    usdlow          :   Number,
    usdask          :   Number,
    usdbid          :   Number
});

const pairsModel = mongoose.model('updatedpairs', updatedPairsSchema);
module.exports = pairsModel;

