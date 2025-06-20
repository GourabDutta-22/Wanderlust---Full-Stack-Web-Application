const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//Create Review
module.exports.createListing = async(req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review (req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
};

//Destroy Review
module.exports.destroyListing = async(req, res) => {
    let {id, reviewId} = req.params;
    let listing = await Listing.findById(req.params.id);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${listing._id}`);
};

