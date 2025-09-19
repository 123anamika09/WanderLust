const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../modals/listing.js");
const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js")
const listingController  = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  timeout: 60000 // 60 seconds timeout
});


// It's a chained route handler — a more elegant and readable way to define multiple methods (GET, POST, PUT, DELETE, etc.) on the same route path.
router
 .route("/")
 .get(wrapAsync(listingController.index))
 .post(
     isLoggedIn,
  upload.single('listing[image][url]'), // multer middleware
  validateListing,  //joi middleware
    wrapAsync(listingController.createListing)
 );


// Search route
router.get("/search", wrapAsync(listingController.searchListings));

// Filter route
router.get("/filter/:category", wrapAsync(listingController.filterListings));

// ✅ ADD THIS AVAILABILITY ROUTE BEFORE THE /:id ROUTE
router.get("/availability", wrapAsync(async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    
    // Get all listings
    let listings = await Listing.find({});
    
    // Add your availability filtering logic here if needed
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Example: Filter based on availability
      // Adjust this logic based on your actual availability system
      listings = listings.map(listing => {
        // For now, we'll just add an isAvailable property
        // You can replace this with your actual availability checking logic
        listing.isAvailable = Math.random() > 0.5; // Random for demo
        return listing;
      });
    } else {
      // If no dates provided, set all as available for demo
      listings = listings.map(listing => {
        listing.isAvailable = Math.random() > 0.5; // Random for demo
        return listing;
      });
    }
    
    res.render("listings/availability", { 
      listings: listings,
      title: "Listings Availability"
    });
    
  } catch (err) {
    console.error("Availability route error:", err);
    req.flash("error", "Something went wrong while fetching availability");
    res.redirect("/listings");
  }
}));

// ----------------- new route ----------------------------
router.get("/new",isLoggedIn,listingController.renderNewForm);
 
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
upload.single('listing[image][url]'),
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