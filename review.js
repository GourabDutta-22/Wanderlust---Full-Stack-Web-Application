const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../util/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

//Reviews
//Post Review Route
router.post("/",
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createListing));


//Post Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyListing));

module.exports = router;