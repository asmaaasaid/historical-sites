
const {check} = require('express-validator');
const validationMiddleWare = require('../../middleware/validationMiddleware');
const subCategoryModel = require('../../Models/subcategoryModel')
const categoryModel = require('../../Models/categoryModel')



exports.createSitesValidation = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Site title must be at least 3 chars")
    .notEmpty()
    .withMessage("Site title is required"),

  // description validate
  check("description")
    .notEmpty()
    .withMessage("Site description is required")
    .isLength({ max: 2000 })
    .withMessage(
      "This description is very large and should not exceed 2000 words"
    ),

  // image cover validate
  check("imageCover").notEmpty().withMessage("Site image cover is required"),

  // image list validat
  check("images")
    .optional()
    .isArray()
    .withMessage("images must be array of string"),

  // category validate
  check("parentCategory")
    .notEmpty()
    .withMessage("The site must belong to a category")
    .isMongoId()
    .withMessage("id format is invalid")
    .custom((categoryId) =>
      categoryModel.findById(categoryId).then((parentCategory) => {
        if (!parentCategory) {
          return Promise.reject(
            new Error(` There is no category for this id ${categoryId}`)
          );
        }
      })
    ),

  // subCategory validate
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("id formate is invalid")
    .custom((subcategoryId)=> subCategoryModel.find({_id:{$exists:true, $in:subcategoryId}}).then(
        (result)=>{
            if(result.length < 1 || result.length !== subcategoryId.length){
                return Promise.reject(new Error(`no subcategory for this id: ${subcategoryId}`))
            }
        }
    ))
    .custom((value, {req})=>subCategoryModel.find({category:req.body.category}).then(
        (subcategory)=>{
            const subcategoriesIdInDB=[];
            subcategory.forEach((subCategoryById)=>{
                subcategoriesIdInDB.push(subCategoryById._id.toString())
            });
            if(!value.every((v)=> subcategoriesIdInDB.includes(v))){
                return Promise.reject(new Error(`this subCategory is not belong to category`))
            }
        }
    )),

  // ratingAverage validate
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("rating average must be number")
    .isLength({ min: 1 })
    .withMessage("The rating must be greater than or equal to 1.0")
    .isLength({ max: 5 })
    .withMessage("The rating must be less than or equal to 5.0"),

  // ratingQuantity validate
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("rating quantity must be number"),

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