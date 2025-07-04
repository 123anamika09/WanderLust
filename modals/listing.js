const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./reviews.js");
const User = require("./user.js")
const listingSchema =  new Schema({
    title:{
       type: String,
       required:true,
    },
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://elements.envato.com/field-landscape-county-kerry-ireland-PKQVQGW",
            set: (v) =>
                v === ""
            ? "https://elements.envato.com/field-landscape-county-kerry-ireland-PKQVQGW"
            : v,
        },
    },
    description:{
       type: String,
       required:true,
    },
    price:Number,
    location:String,
    country:String,
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