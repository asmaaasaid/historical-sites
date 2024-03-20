const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserProfileImage,
  resizeImage,
  
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData
} = require("../Controllers/userController");

const {
  createUserValidation,
  updateUserValidation,
  deleteUserValidation,
  getUserValidation,
  //changeUserPasswordValidator
  updateLoggedUserDataValidation
} = require("../shared/validators/userValidator");

const router = express.Router();
const authService = require("../Controllers/authController");



// for user
router.get('/getMe', authService.protect, getLoggedUserData, getUser);
router.put('/changeMyPassword', authService.protect, updateLoggedUserPassword);
router.put('/updateMe', authService.protect, updateLoggedUserDataValidation, updateLoggedUserData);
router.delete('/deleteMe', authService.protect, deleteLoggedUserData);













router.get("/", authService.protect,
authService.allowedTo('admin'), getUsers);

router.post("/", authService.protect,
authService.allowedTo('admin'), uploadUserProfileImage, resizeImage, createUserValidation, createUser);

router.get("/:id", authService.protect,
authService.allowedTo('admin'), getUserValidation, getUser);

router.put("/:id", authService.protect, authService.allowedTo('admin'), uploadUserProfileImage, resizeImage, updateUserValidation, updateUser);

router.delete("/:id", authService.protect, authService.allowedTo('admin'),  deleteUserValidation, deleteUser);


module.exports = router;
