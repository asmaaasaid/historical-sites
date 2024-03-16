
const { check } = require('express-validator');
const validationMiddleWare = require('../../middleware/validationMiddleware');
const subCategoryModel = require('../../Models/subcategoryModel');
const categoryModel = require('../../Models/categoryModel');

exports.createSitesValidation = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("Site name must be at least 3 chars")
    .notEmpty()
    .withMessage("Site name is required"),

  check("description")
    .notEmpty()
    .withMessage("Site description is required")
    .isLength({ max: 2000 })
    .withMessage("This description is very large and should not exceed 2000 words"),

  check("image")
    .notEmpty()
    .withMessage("Site image  is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),

  check("parentCategory")
    .notEmpty()
    .withMessage("The site must belong to a category")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom((categoryId, { req }) => {
      return categoryModel.findById(categoryId).then((parentCategory) => {
        if (!parentCategory) {
          throw new Error(`There is no category for this id ${categoryId}`);
        }
        // Check if subcategory belongs to the parent category
        if (req.body.subCategory) {
          return subCategoryModel.findOne({
            _id: req.body.subCategory,
            parentCategory: categoryId
          }).then((subCategory) => {
            if (!subCategory) {
              throw new Error("Subcategory doesn't belong to the specified parent category");
            }
          });
        }
      });
    }),

  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID format")
    .custom((subcategoryId) => {
      return subCategoryModel.findById(subcategoryId).then((subcategory) => {
        if (!subcategory) {
          throw new Error(`No subcategory for this id: ${subcategoryId}`);
        }
      });
    }),

  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("Rating average must be a number")
    .isLength({ min: 1 })
    .withMessage("The rating must be greater than or equal to 1.0")
    .isLength({ max: 5 })
    .withMessage("The rating must be less than or equal to 5.0"),

  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Rating quantity must be a number"),

  validationMiddleWare,
];

exports.getSitesValidation = [
  check("id").isMongoId().withMessage("id formate is invalid"),

  validationMiddleWare,
];

exports.updateSiteValidation = [
  check("id").isMongoId().withMessage("id formate is invalid"),

  validationMiddleWare,
];

exports.deleteSiteValidation = [
  check("id").isMongoId().withMessage("id formate is invalid"),

  validationMiddleWare,
];