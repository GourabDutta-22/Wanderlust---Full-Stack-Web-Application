const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require('../util/ExpressError.js');
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing, isReviewAuthor } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); //multer-cloudinary setup
const upload = multer({ storage });


//Using router.route
//Create and Index Route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image][url]"),
        validateListing,
        wrapAsync(listingController.createListing),
    );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show, Update and Delete Route
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put( 
        isLoggedIn, 
        isOwner,
        upload.single("listing[image][url]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.destroyListing)
    )

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;