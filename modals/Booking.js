const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  place: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Booking", bookingSchema);
