const slugify = require("slugify");
const asyncHandler = require('express-async-handler')
const Review = require("../Models/reviewModel")
const ApiError = require('../shared/ErrorsAPI')
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {uploadSingleImage }= require('../middleware/uploadImage')
const factory = require('./handlerFactory')

// Upload single image
exports.uploadReviewImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `review-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/reviews/${filename}`);
    // Save image into our db
    req.body.image = filename;
  }
  next();
});




exports.setSiteIdAndUserIdToBody = (req, res, next) =>{
  if(!req.body.site) req.body.site = req.params.siteId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};




exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.siteId) filterObject = { site: req.params.siteId};
  req.filterObj = filterObject;
  next();
}





// Get All Reviews 
// @route: /api/reviews
exports.getReviews = asyncHandler(async(req, res)=> {
    const listReviews = await Review.find({});
    res.status(200).json({result: listReviews.length, data: listReviews});
});



// get review by ID
// @route: Get /api/reviews/:id
exports.getReview = asyncHandler(async(req, res, next)=> {
  const { id } = req.params;
  const review = await Review.findById(id);
  if(!review){
   return next(new ApiError(`No review for this ID ${id}`, 404));
  }
res.status(200).json({ data: review})
})



// Create new review
// @route: /api/reviews
exports.createReview = asyncHandler(async (req, res) => {
    const { name, ratings, site , image} = req.body;
        const user = req.user._id;

    const review = await Review.create({ name, ratings, user, site, image });
    
    res.status(201).json({ data: review });
});



// Update review by id
// @route: PUT /api/reviews/:id
exports.updateReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params; // Extracting ID from request parameters
    const { name, ratings, image } = req.body; 

    const review = await Review.findByIdAndUpdate(id, { name, ratings, image }, {
        new: true 
    });

    if (!review) {
        return next(new ApiError(`No review found for ID ${id}`, 404));
    }
   review.save();
    res.status(200).json({ data: review });
});



// Delete review By id 
// @route: DELETE /api/reviews/:id
exports.deleteReview = factory.deleteOne(Review);
