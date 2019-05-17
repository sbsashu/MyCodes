'use strict';
const mongoose = require('mongoose');
var dappsvolumeSchema = mongoose.Schema({
    id : {
        type : String,
        unique : true,
    },
    name : String,
    views : [{}],
    updated:Date
});

const dappsModel = mongoose.model('Dapps', dappsvolumeSchema);
module.exports = dappsModel;