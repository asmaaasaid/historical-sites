const User = require("../Models/userModel");
const asyncHandler = require("express-async-handler");



// @route   POST /api/wishlist
//Add product to wishlist and this access for  User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    // $addToSet => add productId to wishlist array if siteId not exist
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { wishlist: req.body.siteId },
      },
      { new: true }
    );
  
    res.status(200).json({
      status: 'success',
      message: 'Site added successfully to your wishlist.',
      data: user.wishlist,
    });
  });




  // Remove site from wishlistonly 
// @route   DELETE /api/wishlist/:productId

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    // $pull => remove productId from wishlist array if productId exist
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.siteId },
      },
      { new: true }
    );
  
    res.status(200).json({
      status: 'success',
      message: 'Site removed successfully from your wishlist.',
      data: user.wishlist,
    });
  });


  
  
  // @desc    Get logged user wishlist by user only
  // @route   GET /api/wishlist
  exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist');
  
    res.status(200).json({
      status: 'success',
      results: user.wishlist.length,
      data: user.wishlist,
    });
  });