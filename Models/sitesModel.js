const mongoose = require("mongoose");
const sequanceModel = require("../Models/sequanceModel");
const sitesSchema = new mongoose.Schema(
  {
    siteId: {
      type: Number,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "The site title must not be less than 3"],
      maxLength: [40, "The site title must not be less than 40"],
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Site description is required"],
      minLength: [
        10,
        "This description is very short and should not be less than 30 words",
      ],
      maxLength: [
        2000,
        "This description is very large and should not exceed 2000 words",
      ],
    },
    imageCover: {
      type: [String],
      required: [true, "Site image cover is required"],
    },
    images: [String],
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "The site must belong to a category"],
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    ratingAverage: {
      type: Number,
      min: [1, "The rating must be greater than or equal to 1.0"],
      max: [5, "The rating must be less than or equal to 5.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
   // to enable virtual populate
   toJSON: { virtuals: true },
   toObject: { virtuals: true },
 }
);


//to get site by his reviews
sitesSchema.virtual('reviews', {
 ref: 'Review',
 foreignField: 'site',
 localField: '_id',
});







sitesSchema.pre("save", async function (next) {
  if (!this.siteId) {
    this.siteId = await getNextSiteId();
  }
  next();
});

sitesSchema.pre("find", function (next) {
  this.populate({
    path: "parentCategory",
    select: "name",
  });
  next();
});

//set Image URL
const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/sites/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/sites/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};

//find all, findeOne , update
sitesSchema.post("init", (doc) => {
  setImageUrl(doc);
});

//create
sitesSchema.post("save", (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("Sites", sitesSchema);