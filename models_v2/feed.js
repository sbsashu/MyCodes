'use strict';
const mongoose = require('mongoose');
var FeedSchema = mongoose.Schema({
    generator:String,
    content : String,
    isoDate: Date,
    pubDate: String,
    title: {type:String, unique: true},
    currency:String,
    link:String,
    category:String,
    created_at:Date,
    image:{},
    source:String,
    related:String,
    isRead:Boolean
});

const SymbolModel = mongoose.model('Feed', FeedSchema);
module.exports = SymbolModel;