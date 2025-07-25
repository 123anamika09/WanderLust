const Listing = require("./modals/listing")
const Review = require("./modals/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema  } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};
// module.exports.isOwner = async (req, res, next) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);

//     // Check: User not logged in OR user is NOT the owner
//     if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
//         req.flash("error", "You are not the owner of this list. ");
//         return res.redirect(`/listings/${id}`);
//     }
//     next(); // user is owner, continue to next middleware/route
// };.


module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        
        if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);  // Proper error handling
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    
    if (!review) {
    req.flash("error", "Review not found.");
    return res.redirect(`/listings/${id}`);
  }  
  if (!review.author || !review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review.");
    return res.redirect(`/listings/${id}`);
  }
    next(); 
};






//  validate fnc for listing schema 
module.exports.validateListing =(req,res,next)=>{

    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//  validate fnc for review schema
module.exports.validateReview =(req,res,next)=>{

    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}