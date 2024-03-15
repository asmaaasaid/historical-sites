const { check } = require('express-validator');
const validationMiddleWare = require('../../middleware/validationMiddleware');



exports.getCategoryValidation = [
    check('id').isMongoId().withMessage('Category id has an invalid format'),
    validationMiddleWare
];




exports.createCategoryValidation = [
    check('name')
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3 })
        .withMessage('Category Name is short')
        .isLength({ max: 30 })
        .withMessage('Category Name is long'),
    check('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description is too long'),
    validationMiddleWare
];



exports.updateCategoryValidation = [
    check('id').isMongoId().withMessage('Category id has an invalid format'),
    check('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description is too long'),
    validationMiddleWare
];




exports.deleteCategoryValidation = [
    check('id').isMongoId().withMessage('Category id has an invalid format'),
    validationMiddleWare
];



