const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require('../util/ExpressError.js');


//Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

//Index Route
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

//Show Route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    } else {
        res.render("./listings/show.ejs", { listing });
    }
};


//Create Route
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    //let{title, description, image, price, location, country}=req.body;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect(`/listings/${newListing._id}`);

};

//Edit route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300/e_blur:100");
    res.render("./listings/edit.ejs", { listing, originalImageUrl});
};

//Update Route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

//Destroy Route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const DeletedListing = await Listing.findByIdAndDelete(id);
    console.log(DeletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};