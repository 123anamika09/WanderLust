const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
   
}) 
 userSchema.plugin(passportLocalMongoose); // automatically username , password , hashing , salting all provided so we define only emailin schema

 module.exports = mongoose.model('User', userSchema);