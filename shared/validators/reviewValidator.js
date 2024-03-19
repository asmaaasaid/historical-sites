const { check } = require('express-validator');
const Review = require('../../Models/reviewModel');
const validationMiddleWare = require('../../middleware/validationMiddleware');

exports.createReviewValidator = [
  check('name').optional(),
  check('ratings')
    .notEmpty()
    .withMessage('ratings value required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings value must be between 1 to 5'),
  check('user').isMongoId().withMessage('Invalid Review id format'),
  check('site')
    .isMongoId()
    .withMessage('Invalid Review id format'),
  validationMiddleWare,
];

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validationMiddleWare,
];

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) =>
      // Check review ownership before update
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
      })
    ),
  validationMiddleWare,
];

exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) => {
      // Check review ownership before update
      if (req.user.role === 'user') {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        });
      }
      return true;
    }),
  validationMiddleWare,
];
