const mongoose = require('mongoose');
const Sites = require('./sitesModel');

const reviewSchema = new mongoose.Schema(
    {
      name: {
        type: String,
      },
      ratings: {
        type: Number,
        min: [1, 'Min ratings value is 1.0'],
        max: [5, 'Max ratings value is 5.0'],
        required: [true, 'review ratings required'],
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to user'],
      },
      // parent reference (one to many)
      site: {
        type: mongoose.Schema.ObjectId,
        ref: 'Sites',
        required: [true, 'Review must belong to site'],
      },
      image: [String], 
      },
    
    { timestamps: true }
  ); 



  reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name profileImage' });
    next();
  });
  


  const setImageURL = (doc) => {
    if (doc.image) {
      const imageUrl = `${process.env.BASE_URL}/reviews/${doc.image}`;
      doc.image = imageUrl;
    }
    else{
      delete doc.image
    }
  };
  // findOne, findAll and update
  reviewSchema.post('init', (doc) => {
    setImageURL(doc);
  });
  
  // create
  reviewSchema.post('save', (doc) => {
    setImageURL(doc);
  });

  





//calculate the average rating on every site 
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  siteId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific site
    {
      $match: { site: siteId },
    },
    // Stage 2: Grouping reviews based on siteID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: 'site',
        avgRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  //console.log(result);
  
  if (result.length > 0) {
    await Sites.findByIdAndUpdate(siteId, {
      ratingAverage: result[0].avgRatings,
      ratingQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Sites.findByIdAndUpdate(siteId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.site);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.site);
});










  module.exports = mongoose.model('Review', reviewSchema);