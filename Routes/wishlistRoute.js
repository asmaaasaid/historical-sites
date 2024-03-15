const express = require("express");

const {addProductToWishlist,
     removeProductFromWishlist,
      getLoggedUserWishlist} = require("../Controllers/wishlistController");

const router = express.Router();
const authService = require('../Controllers/authController');




router.post("/", authService.protect, authService.allowedTo('user'), addProductToWishlist );
router.delete("/:siteId", authService.protect, authService.allowedTo('user'), removeProductFromWishlist );
router.get("/", authService.protect, authService.allowedTo('user'), getLoggedUserWishlist );


module.exports = router;
