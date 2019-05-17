'use strict';
const mongoose = require('mongoose');
var totalVolumeSchema = mongoose.Schema({
    uid : {
        type : String,
        unique : true,
    },
    volumes:[{
    	created_at:Date,
    	volume:Number
    }],
    lastVolume:Number
});

const MyModel = mongoose.model('TotalVolume', totalVolumeSchema);
module.exports = MyModel;