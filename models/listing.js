const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require('joi');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: {
            type: String
        },
        filename: {
            type: String
        }
    },
    price: Number,
    location: String,
    country: String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

listingSchema.index({
    title: "text",
    description: "text",
    location: "text",
    country: "text"
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.review}});
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;