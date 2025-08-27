const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./reviews.js");
const User = require("./user.js");
const { string } = require("joi");
const listingSchema =  new Schema({
    title:{
       type: String,
       required:true,
    },
    image: {
       url: String,
      filename:String,
    },
    description:{
       type: String,
       required:true,
    },
    price:Number,
    location:String,
    country:String,
    category: {
      type: String,
      enum: ['Mountains', 'Pools', 'Beach', 'Trending', 'Castles', 'Camping', 'Farms', 'Arctic'],
      required: true
    },
   reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
// Mongoose middleware - saare review ko delete kr dena
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
  await Review.deleteMany({_id:{$in:listing.reviews}})
  }
})
const Listing = mongoose.model("Listing" ,listingSchema);
module.exports= Listing;