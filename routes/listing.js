const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../modals/listing.js");
const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js")
const listingController  = require("../controllers/listings.js")

// -----index route------------------------------------------
router.get("/", wrapAsync(listingController.index));


// ----------------create : New & create Route-------------
// ----------------- new route ----------------------------
router.get("/new",isLoggedIn,listingController.renderNewForm);
 
// -----------show route--------------------------------
router.get("/:id",wrapAsync(listingController.showListing));

// ------------------------create Route------------
router.post("/",
validateListing,
isLoggedIn,
    wrapAsync(listingController.createListing)
);


// --------------update route = edit & update route  -- Get And Put req --------------------------
router.get("/:id/edit",
     isLoggedIn
    ,isOwner,
    wrapAsync(listingController.renderEditForm));

// update rout
router.put("/:id" ,
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
);
// --------------------delete route---------------
router.delete("/:id",isLoggedIn
    ,isOwner
    ,wrapAsync(listingController.destroyListing )
);

module.exports= router;