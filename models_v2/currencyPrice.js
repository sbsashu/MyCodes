'use strict';
const mongoose = require('mongoose');
var currencypriceSchema = mongoose.Schema({
    name : {
        type : String,
        unique:true
    },
    id:{
        type : String,
        unique:true
    },
    symbol:String,
    price_list :[{}]

});

const currencypriceModel = mongoose.model('currencisePrice', currencypriceSchema);
module.exports = currencypriceModel;