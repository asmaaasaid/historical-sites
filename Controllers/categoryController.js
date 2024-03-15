const slugify = require("slugify");
const asyncHandler = require('express-async-handler')
const categoryModel = require("../Models/categoryModel")
const ApiError = require('../shared/ErrorsAPI')
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {uploadSingleImage }= require('../middleware/uploadImage')
const factory = require('./handlerFactory')

// Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});


// Get All categories 
// @route: /api/categories
exports.getCategories = asyncHandler(async(req, res)=> {
    const allCategories = await categoryModel.find({});
    res.status(200).json({result: allCategories.length, data: allCategories});
});



// get category by ID
// @route: Get /api/categories/:id
exports.getCategory = asyncHandler(async(req, res, next)=> {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if(!category){
   return next(new ApiError(`No category for this ID ${id}`, 404));
  }
res.status(200).json({ data: category})
})



// Create new Category
// @route: /api/categories
exports.createCategory = asyncHandler(async (req, res) => {
    try {
        let lastCategory = await categoryModel.findOne().sort({ categoryId: -1 });

        let categoryId;
        if (lastCategory) {
            categoryId = lastCategory.categoryId + 1;
        } else {
            categoryId = 1;
        }
        const { name, description, image } = req.body;
        const category = await categoryModel.create({ categoryId, name, description, image, slug: slugify(name) });
        res.status(201).json({ data: category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




// Update category by id 
// @route: PUT /api/categories/:id
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const category = await categoryModel.findOneAndUpdate(
        { _id: id },
        { name, description, image, slug: slugify(name) },
        { new: true }
    );

    if (!category) {
        return next(new ApiError(`No category for this ID ${id}`, 404));
    }
    res.status(200).json({ data: category });
});




// Delete Category By id 
// @route: DELETE /api/categories/:id
exports.deleteCategory = factory.deleteOne(categoryModel);
