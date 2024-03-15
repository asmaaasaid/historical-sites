const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const sharp = require("sharp");
const User = require("../Models/userModel");
const ApiError = require("../shared/ErrorsAPI");
const { uploadSingleImage } = require('../middleware/uploadImage');
const factory = require("../Controllers/handlerFactory");
const bcrypt = require('bcryptjs');
const createToken = require('../shared/createToken.js')


// Upload single image middleware for user profile images
exports.uploadUserProfileImage = uploadSingleImage('profileImage');

// Image processing middleware for user profile images
exports.resizeImage = asyncHandler (async (req, res, next) => {
   const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

   if (req.file) {
    await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${filename}`);

  // Save the filename into the req.body
  req.body.profileImage = filename;
   }
    next();
  
});

// Get all users
// @route: /api/users
exports.getUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find({});
  res.status(200).json({ result: allUsers.length, data: allUsers });
});

// Get user by ID
// @route: GET /api/users/:id
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ApiError(`No user found for ID ${id}`, 404));
  }
  res.status(200).json({ data: user });
});

// Create new user
// @route: POST /api/users
exports.createUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, password, profileImage, role } = req.body;

    const user = await User.create({
      name,
      email,
      phone,
      password,
      slug: slugify(name),
      profileImage,
      role
    });

    res.status(201).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update user by ID
// @route: PUT /api/users/:id
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});


// Delete user by ID
// @route: DELETE /api/users/:id
exports.deleteUser = factory.deleteOne(User);




//To make logged user interact with his data:


//Get Logged user data
// @route   GET /api/v1/users/getMe
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});


// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});


//Update logged user data (without password, role)
// @route   PUT /api/users/updateMe
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});



// Deactivate logged user
// @route  DELETE /api/users/deleteMe
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});