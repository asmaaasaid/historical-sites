const express = require("express");

const {
getReviews,
getReview,
  createReview,
  updateReview,
  deleteReview,
  uploadReviewImage,
  resizeImage,
  createFilterObj,
  setSiteIdAndUserIdToBody
} = require("../Controllers/reviewController");


const {
    getReviewValidator,
    createReviewValidator,
    updateReviewValidator,
    deleteReviewValidator
  } = require("../shared/validators/reviewValidator");



const authService = require('../Controllers/authController');

const router = express.Router({mergeParams: true}); //access any params from routes




router.get("/", createFilterObj, getReviews);
router.post("/", authService.protect, authService.allowedTo('user'),uploadReviewImage, resizeImage, setSiteIdAndUserIdToBody, createReviewValidator, createReview);
router.get("/:id", getReviewValidator, getReview);
router.put("/:id",  authService.protect, authService.allowedTo('user'), uploadReviewImage, resizeImage, updateReviewValidator, updateReview);
router.delete("/:id",  authService.protect, authService.allowedTo('admin','user'), deleteReviewValidator, deleteReview);

module.exports = router;
 