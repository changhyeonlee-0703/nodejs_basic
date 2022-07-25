const mongoose = require("mongoose");

const connect = ()=>{
    mongoose
    .connect("mongodb://localhost:27017/spa_mall", {ignoreUndefined :true}) //undefined값은 무시해줘! 
    .catch((err)=>{
        console.error(err);
    });
};


module.exports=connect;