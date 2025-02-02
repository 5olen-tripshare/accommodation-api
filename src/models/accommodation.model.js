const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: [{ type: String }],
    reviews: {
      rating: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    topCriteria: [{ type: String }],
    interests: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    totalPlaces: { type: Number, required: true },
    numberRoom: { type: Number, required: true },
    squareMeter: { type: Number, required: true },
    bedRoom: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accommodation", accommodationSchema);
