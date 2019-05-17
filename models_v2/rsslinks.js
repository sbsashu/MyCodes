'use strict';
const mongoose = require('mongoose');
var rsslinkSchema = mongoose.Schema({
    link:String,
    category:String,
    status:Boolean,
    source:String,
    related:String
});

const SymbolModel = mongoose.model('Rsslink', rsslinkSchema);
module.exports = SymbolModel;