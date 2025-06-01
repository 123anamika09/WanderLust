const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
  ]
});

const Listing = mongoose.model("Listing" ,listingSchema);
module.exports= Listing;    