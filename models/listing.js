const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://www.vecteezy.com/photo/2411833-travel-and-holiday-concept",
        set: (v) => v === "" ? "https://www.vecteezy.com/photo/2411833-travel-and-holiday-concept" : v
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;