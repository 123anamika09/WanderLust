const express = require("express");
const router = express.Router();
const { 
  newBooking, 
  showBookings, 
  renderBookingForm, 
  checkAvailability,
  getAllListingsAvailability 
} = require("../controllers/bookingController");
const { isLoggedIn } = require("../middleware");

router.get("/listings/:id/book", isLoggedIn, renderBookingForm);
router.post("/book", isLoggedIn, newBooking);
router.get("/my-bookings", isLoggedIn, showBookings);

// New routes for availability
router.post("/check-availability", checkAvailability);
router.get("/listings/availability", getAllListingsAvailability);

module.exports = router;
