'use strict';
const mongoose = require('mongoose');
var currencyPairsVolumeSchema = mongoose.Schema({
    symbol : {
        type : String
    },
    name : String,
    totalVolume:[{}],
    last_updated:Date
});

const currencyPairsVolumeModel = mongoose.model('currencyPairsVolume', currencyPairsVolumeSchema);
module.exports = currencyPairsVolumeModel;