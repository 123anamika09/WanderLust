const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../modals/reviews.js");
const Listing = require("../modals/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")

// --------------------------review Route--------------------
//  Post review Route
router.post("/", 
    isLoggedIn,
     validateReview,
     wrapAsync(async (req, res) => { // here validate review pss as a middleware  & wrapAsync is used here to handling error 
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
}));


// DELETE Route to delete review 
// /listings/:id/reviews ye comman part h saare route me to isk hm hta kr direct  use kr skte 
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
   await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });
 // reviews array se reviewid ko delete krn 
     await Review.findByIdAndDelete(reviewId);
      req.flash("success","review deleted");
     res.redirect(`/listings/${id}`);
}))



module.exports= router;