const Listing = require('../models/listing.js');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
};

module.exports.renderNewListingForm = (req, res) => {
    res.render('listings/new.ejs');
};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.validatedListing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: 'review', populate: { path: 'author'}}).populate("owner");
    if (!listing) {
        req.flash("error", "The Listing you are looking for does not exist!");
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The Listing you are trying to update does not exist!");
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
};