'use strict';
const mongoose = require('mongoose');
var usdSchema = mongoose.Schema({
    symbol :  String,
    usdValue :Number,
    updated_at:Date
});

const SymbolModel = mongoose.model('usdvalues', usdSchema);
module.exports = SymbolModel;