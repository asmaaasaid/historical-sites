const express = require("express");

const subCategoryRoute = require('./subCategoryRoutes');
const siteRoute = require('./sitesRoute')

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../Controllers/categoryController");
const {
  getCategoryValidation,
  createCategoryValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
} = require("../shared/validators/categoryValidator");

const router = express.Router();
const authService = require('../Controllers/authController');



// route of get all sub categories by main category id 
router.use('/:categoryId/subCategories', subCategoryRoute);
router.use('/:categoryId/sites', siteRoute);

router.get("/", getCategories);
router.post("/", authService.protect, authService.allowedTo('admin'), uploadCategoryImage, resizeImage, createCategoryValidation, createCategory);
router.get("/:id", getCategoryValidation, getCategory);
router.put("/:id",  authService.protect, authService.allowedTo('admin'), uploadCategoryImage, resizeImage, updateCategoryValidation, updateCategory);
router.delete("/:id",   authService.protect, authService.allowedTo('admin'), deleteCategoryValidation, deleteCategory);

module.exports = router;
