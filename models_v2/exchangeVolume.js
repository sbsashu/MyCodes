'use strict';
const mongoose = require('mongoose');
var exchangeSchema = mongoose.Schema({
    uid : {
        type : String,
        unique : true,
    },
    name : String,
    totalVolume:[{}],
    last_updated:Date
});

const exchangeVolumeModel = mongoose.model('exchangeVolume', exchangeSchema);
module.exports = exchangeVolumeModel;