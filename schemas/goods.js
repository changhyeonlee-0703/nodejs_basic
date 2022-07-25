const mongoose = require("mongoose");

const goodsSchema = mongoose.Schema({
    goodsId : {
        type : Number,
        required : true, //필수 값인지
        unique : true // 겹치는 것이 없게 한다.
    },
    name : {
        type : String,
        required : true,
        unique : true
    },
    thumbnailUrl : {
        type : String
    },
    category : {
        type : String
    },
    price : {
        type : Number
    }
});


module.exports = mongoose.model("Goods",goodsSchema);