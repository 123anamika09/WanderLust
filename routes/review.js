const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../modals/reviews.js");
const Listing = require("../modals/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");
const { destroyListing } = require("../controllers/listings.js");


// --------------------------review Route--------------------
//  Post review Route
router.post("/", 
    isLoggedIn,
     validateReview,
     wrapAsync(reviewController.createReview));


// DELETE Route to delete review 
// /listings/:id/reviews ye comman part h saare route me to isk hm hta kr direct  use kr skte 
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);



module.exports= router;