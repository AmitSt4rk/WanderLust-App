const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');

const validateListing = (req, res, next) => {
    let { error, value } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        req.validatedListing = value;
        next();
    }
}

router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}));

router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
});

router.post('/', validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.validatedListing);
    await newListing.save();
    res.redirect('/listings');
}));

router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('review');
    res.render('listings/show.ejs', { listing });
}));

router.get('/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));

router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect('/listings');
}));

router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

module.exports=router;