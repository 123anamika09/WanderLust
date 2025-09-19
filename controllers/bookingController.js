const Listing = require("../modals/listing");
const Booking = require("../modals/Booking");

// Helper function to check if a listing is available for given dates
async function checkAvailability(listingId, checkIn, checkOut) {
  // Convert string dates to Date objects if they're not already
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Find any bookings that overlap with the requested dates
  const overlappingBookings = await Booking.find({
    place: listingId,
    $or: [
      // Case 1: Check-in date falls within an existing booking
      { 
        checkIn: { $lte: checkOutDate },
        checkOut: { $gte: checkInDate }
      }
    ]
  });
  
  // If there are any overlapping bookings, the listing is not available
  return overlappingBookings.length === 0;
}

// Get all bookings for a listing to show availability calendar
async function getListingBookings(listingId) {
  return await Booking.find({ place: listingId }, 'checkIn checkOut');
}

module.exports.newBooking = async (req, res) => {
  const { placeId, checkIn, checkOut, guests } = req.body;
  const listing = await Listing.findById(placeId);
  if (!listing) return res.redirect("/");
  
  // Check if the listing is available for the requested dates
  const isAvailable = await checkAvailability(placeId, checkIn, checkOut);
  
  if (!isAvailable) {
    req.flash("error", "Sorry, this listing is not available for the selected dates.");
    return res.redirect(`/listings/${placeId}/book`);
  }

  const booking = await Booking.create({
    user: req.user._id,
    place: placeId,
    checkIn,
    checkOut,
    guests,
  });

  req.flash("success", "Booking successful!");
  res.redirect("/my-bookings");
};

module.exports.showBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("place");
  // Filter out bookings where the place (listing) has been deleted
  const validBookings = bookings.filter(booking => booking.place !== null);
  res.render("bookings/index", { bookings: validBookings });
};

module.exports.renderBookingForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  
  // Get all bookings for this listing to show unavailable dates
  const existingBookings = await getListingBookings(id);
  
  res.render("bookings/new", { listing, existingBookings: JSON.stringify(existingBookings) });
};

// New route to check availability via AJAX
module.exports.checkAvailability = async (req, res) => {
  const { listingId, checkIn, checkOut } = req.body;
  
  try {
    const isAvailable = await checkAvailability(listingId, checkIn, checkOut);
    res.json({ available: isAvailable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all listings with availability status
module.exports.getAllListingsAvailability = async (req, res) => {
  try {
    const listings = await Listing.find({});
    
    // Get dates from query parameters or use default (today and tomorrow)
    let checkInDate, checkOutDate;
    
    if (req.query.checkIn && req.query.checkOut) {
      checkInDate = req.query.checkIn;
      checkOutDate = req.query.checkOut;
    } else {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      checkInDate = today.toISOString().split('T')[0];
      checkOutDate = tomorrow.toISOString().split('T')[0];
    }
    
    // For each listing, check if it's available for the specified dates
    const listingsWithAvailability = await Promise.all(
      listings.map(async (listing) => {
        const isAvailable = await checkAvailability(
          listing._id, 
          checkInDate,
          checkOutDate
        );
        
        return {
          ...listing.toObject(),
          isAvailable
        };
      })
    );
    
    res.render("listings/availability", { listings: listingsWithAvailability });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/listings");
  }
};
