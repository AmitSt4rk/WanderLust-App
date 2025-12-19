const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { throwDeprecation } = require('process');
const {listingSchema} = require('./schema.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
    .then(res => console.log("Connection successful!"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get('/', (req, res) => {
    res.send("Server is working.");
});

const validateListing = (req, res, next) => {
    let {error, value} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

app.get('/testListing', wrapAsync(async (req, res) => {
    let sampleListing = new Listing({
        title: "My new Home!",
        description: "By the Mountains.",
        price: 1600,
        location: "Garhwal Himalayas, Uttarakhand",
        country: "India"
    });

    await sampleListing.save();
    res.send("Testing Successful!");
}));

app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}));

app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(value);
    await newListing.save();
    res.redirect('/listings');
}));

app.get('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
}));

app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));

app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect('/listings');
}));

app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {status = 500, message = "something went wrong!"} = err;
    res.status(status).render('error.ejs', {message});
});

app.listen(8080, () => {
    console.log("Server is listening at port: 8080");
});