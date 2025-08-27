
const Listing = require("../modals/listing");
const Review = require("../modals/reviews")

module.exports.createReview = async (req, res) => { // here validate review pss as a middleware  & wrapAsync is used here to handling error 
    // console.log(req.params.id);
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        if (!listing.reviews) {
            listing.reviews = [];
        }
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log(newReview);
        await newReview.save();

        listing.reviews.push(newReview._id);
        await listing.save();
         req.flash("success","New review created");


        console.log("New review saved");
        res.redirect(`/listings/${listing._id}`); // change krn k baad v usii page pr aana

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}
module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
   await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });
 // reviews array se reviewid ko delete krn 
     await Review.findByIdAndDelete(reviewId);
      req.flash("success","review deleted");
     res.redirect(`/listings/${id}`);
}