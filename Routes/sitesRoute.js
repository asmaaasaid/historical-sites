const express = require('express');

const {createSitesValidation,
       updateSiteValidation,
       getSitesValidation,
       deleteSiteValidation} = require('../shared/validators/sitesValidator');

const {getAllSites,
       getSiteById,
       createNewSite,
       updateSite,
       deleteSite, uploadSiteImages, resizeSiteImages, createFilterObj} = require('../Controllers/sitesController');

const router = express.Router({mergeParams: true});
const authService = require("../Controllers/authController");
const reviewRoute = require('../Routes/reviewRoute')

//Route of get all reviews to site id  from all sites
// POST   /sites/siteId/reviews
// GET    /sites/siteId/reviews
// GET    /sites/siteId/reviews/reviewId
router.use('/:siteId/reviews', reviewRoute);  


router.route('/').get(createFilterObj, getAllSites)
.post( authService.protect,
       authService.allowedTo('admin'), uploadSiteImages, resizeSiteImages, createSitesValidation , createNewSite);

router.route('/:id')
.get(getSitesValidation , getSiteById)
.put( authService.protect,
       authService.allowedTo('admin'), uploadSiteImages, resizeSiteImages, updateSiteValidation , updateSite)
.delete( authService.protect,
       authService.allowedTo('admin'), deleteSiteValidation , deleteSite);

module.exports = router;