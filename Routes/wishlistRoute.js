const express = require("express");

const {addSiteToWishlist,
     removeSiteFromWishlist,
      getLoggedUserWishlist} = require("../Controllers/wishlistController");

const router = express.Router();
const authService = require('../Controllers/authController');




router.post("/", authService.protect, authService.allowedTo('user'), addSiteToWishlist );
router.delete("/:siteId", authService.protect, authService.allowedTo('user'), removeSiteFromWishlist );
router.get("/", authService.protect, authService.allowedTo('user'), getLoggedUserWishlist );


module.exports = router;
