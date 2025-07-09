const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../modals/listing.js");
const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js")
const listingController  = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage }) // khud se upload file bnkr save ho gya wha hm image store ho gya


// It's a chained route handler — a more elegant and readable way to define multiple methods (GET, POST, PUT, DELETE, etc.) on the same route path.
router
 .route("/")
 .get(wrapAsync(listingController.index))
//  .post(
//      isLoggedIn,
//   validateListing,
//     wrapAsync(listingController.createListing)
// );
.post( upload.single('listing[image][url]'),(req,res)=>{
    res.send(req.file);
})

// ----------------- new route ----------------------------
router.get("/new",isLoggedIn,listingController.renderNewForm);
 
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn
    ,isOwner
    ,wrapAsync(listingController.destroyListing )
);


// --------------update route = edit & update route  -- Get And Put req --------------------------
router.get("/:id/edit",
     isLoggedIn
    ,isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports= router;