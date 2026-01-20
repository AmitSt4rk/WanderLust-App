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
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
}));

router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('review');
    if (!listing) {
        req.flash("error", "The Listing you are looking for does not exist!");
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
}));

router.get('/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The Listing you are trying to update does not exist!");
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { listing });
}));

router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Listing Updated!");
    res.redirect('/listings');
}));

router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}));

module.exports=router;