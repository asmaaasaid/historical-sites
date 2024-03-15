const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../shared/ErrorsAPI");
const subCategoryModel = require("../Models/subcategoryModel");
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {uploadSingleImage }= require('../middleware/uploadImage')


// Upload single image
exports.uploadSubCategoryImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `subCategory-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/subcategories/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});




exports.setCategoryIdToBody = (req, res, next) =>{
    if(!req.body.parentCategory) req.body.parentCategory = req.params.categoryId;
    next();
};



//create subCategory
//@route: POST /api/subCategories
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, parentCategory, description, image } = req.body;
  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    description,
    image,
    parentCategory
  });
  res.status(201).json({ data: subCategory });
});


exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { parentCategory: req.params.categoryId};
    req.filterObj = filterObject;
    next();
}



// Get All subCategories
// @route: /api/subCategories
exports.getAllSubCategories = asyncHandler(async (req, res) => {

  const allSubCategories = await subCategoryModel.find(req.filterObj)
    .populate({ path: "parentCategory", select: "name categoryId" });
  res.status(200)
    .json({ result: allSubCategories.length, data: allSubCategories });
});






// get subCategory by objectId
// @route: Get /api/subCategories/:id
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel
    .findById(id)
    .populate({ path: "parentCategory", select: "name categoryId" });
  if (!subCategory) {
    return next(new ApiError(`No category for this ID ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});





// Update subCategory by id
// @route: PUT /api/subCategories/:id
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, image , description, parentCategory } = req.body;

  const subCategory = await subCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), description, parentCategory  , image},
    { new: true }
  );

  if (!subCategory) {
    return next(new ApiError(`No subCategory for this ID ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});







// Delete subCategory By id
// @route: DELETE /api/subCategories/:id
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new ApiError(`No subCategory for this ID ${id}`, 404));
  }
  res.status(200).json({ message: "SubCategory Deleted" });
});
