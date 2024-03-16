const express = require('express');
const { createSubCategory, getAllSubCategories, getSubCategory, 
    updateSubCategory, deleteSubCategory, setCategoryIdToBody, createFilterObj, uploadSubCategoryImage, resizeImage } = require('../Controllers/subcategoryController');
const { createSubCategoryValidation, getSubCategoryValidation, updateSubCategoryValidation, deleteSubCategoryValidation } = require('../shared/validators/subCategoryValidator');

const authService = require('../Controllers/authController');
const siteRoute = require('./sitesRoute')

const router = express.Router({mergeParams: true}); //access any params from routes
router.use('/:subCategoryId/sites', siteRoute);

router.post(('/'),  authService.protect, authService.allowedTo('admin'), uploadSubCategoryImage, resizeImage, setCategoryIdToBody, createSubCategoryValidation, createSubCategory);
router.get(('/'), createFilterObj, getAllSubCategories);
router.get(('/:id'), getSubCategoryValidation, getSubCategory);
router.put(('/:id'),  authService.protect, authService.allowedTo('admin'), uploadSubCategoryImage, resizeImage, updateSubCategoryValidation, updateSubCategory);
router.delete(('/:id'), authService.protect, authService.allowedTo('admin'), deleteSubCategoryValidation, deleteSubCategory);

 



module.exports = router;
