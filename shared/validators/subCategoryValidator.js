const { check } = require("express-validator");
const validationMiddleWare = require("../../middleware/validationMiddleware");


exports.createSubCategoryValidation = [
    check('name')
        .notEmpty()
        .withMessage('subCategory name is required')
        .isLength({ min: 3 })
        .withMessage('subCategory Name is short')
        .isLength({ max: 20 })
        .withMessage('subCategory Name is long'),
        check('parentCategory')
        .notEmpty().withMessage('subCategory must belong to category')
        .isMongoId().withMessage('Category id has an invalid format'),
    validationMiddleWare
];



exports.getSubCategoryValidation = [
    check('id').isMongoId().withMessage('subCategory id has an invalid format'),
    validationMiddleWare
];




exports.updateSubCategoryValidation = [
    check('id').isMongoId().withMessage('subCategory id has an invalid format'),
    validationMiddleWare
];




exports.deleteSubCategoryValidation = [
    check('id').isMongoId().withMessage('subCategory id has an invalid format'),
    validationMiddleWare
];

