const { check, body } = require("express-validator");
const validationMiddleWare = require("../../middleware/validationMiddleware");
const bcrypt = require('bcryptjs');
const User = require("../../Models/userModel");

exports.createUserValidation = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User Name is short"),

  check("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject("Email is already in user");
        }
      })
    ),

  check('password')
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage("Password confirmation required"),

  check('phone').optional().isMobilePhone(["ar-EG", "ar-KW", "ar-SA", "any"]),

  check('profileImage').optional(),
  check('role').optional(),
  validationMiddleWare,
];

exports.getUserValidation = [
  check("id")
    .notEmpty()
    .isMongoId()
    .withMessage("User id has an invalid format"),
  validationMiddleWare,
];

exports.updateUserValidation = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  
  check('email')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA', 'any'])
    .withMessage('Invalid phone number'),

  check('profileImage').optional(),
  check('role').optional(),
  validationMiddleWare,
];






exports.deleteUserValidation = [
  check("id")
    .notEmpty()
    .isMongoId()
    .withMessage("User id has an invalid format"),
  validationMiddleWare,
];


exports.updateLoggedUserDataValidation = [
  body('name')
    .optional(),
  
  check('email')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA', 'any'])
    .withMessage('Invalid phone number'),


  validationMiddleWare,
];



