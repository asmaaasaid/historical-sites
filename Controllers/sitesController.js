const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Sites = require("../Models/sitesModel");
const ApiError = require("../shared/ErrorsAPI");
const sequanceModel = require("../Models/sequanceModel");
const ApiFeatures = require("../shared/apiFeatures");
const factory = require("../Controllers/handlerFactory");
const sharp = require("sharp");
const { uploadMixOfImages } = require("../middleware/uploadImage");
const { v4: uuidv4 } = require("uuid");

exports.uploadSiteImages = uploadMixOfImages([
  {
    name: "image",
    maxCount: 1,
  },

  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeSiteImages = asyncHandler(async (req, res, next) => {
  console.log(req.files);

  if (req.files.image) {
    const imageCoverFileName = `site-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.files.image[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/sites/${imageCoverFileName}`);

    req.body.image = imageCoverFileName;
  }

  // images processing
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `site-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/sites/${imageName}`);

        req.body.images.push(imageName);
      })
    );

    next();
  }
});

exports.createFilterObj = (req, res, next) => {
let filterObject = {};
  
if (req.params.categoryId) {
  filterObject.parentCategory = req.params.categoryId;
}

if (req.params.subCategoryId) {
  filterObject.subCategory = req.params.subCategoryId;
}

req.filterObj = filterObject;
next();
}

// Get list of sites
exports.getAllSites = asyncHandler(async (req, res) => {
  const documentsCounts = await Sites.countDocuments();

  // Build query
  const apiFeatures = new ApiFeatures(Sites.find(req.filterObj), req.query)
  .search()  
  .paginate(documentsCounts)
    //.filter()
    
    .limitFields()
    .sort()
    .populate();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const sites = await mongooseQuery;

  res.status(200).json({ results: sites.length, paginationResult, data: sites });
});



// Get one site by ID with optional population
exports.getSiteById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const site = await Sites.findById(id)
      .populate({
        path: 'parentCategory',
        select: 'name',
      })
      .populate('reviews'); 
  
    if (!site) {
      return next(new ApiError(`There is no site for this id ${id}`, 404));
    }
    
    // Return the site data
    res.status(200).json({ data: site });
  } catch (error) {
    return next(new ApiError('Internal Server Error', 500));
  }
});

// Create new site
exports.createNewSite = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  const siteId = await getNextSiteId();
  const site = await Sites.create({ ...req.body, siteId });
  res.status(201).json({ data: site });
});


async function getNextSiteId() {
  try {
    const lastSite = await Sites.findOne({}, { siteId: 1 }).sort({
      siteId: -1,
    });
    let lastSiteId = lastSite ? lastSite.siteId : 0;
    const updatedCounter = await sequanceModel.findOneAndUpdate(
      { name: "siteId" },
      { $set: { value: lastSiteId + 1 } },
      { new: true, upsert: true }
    );
    return updatedCounter.value;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate siteId");
  }
}

exports.updateSite = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const site = await Sites.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!site) {
    return next(new ApiError(`There is no site for this id ${id}`, 404));
  }
  res.status(200).json({ data: site });
});


// Delete site by id
exports.deleteSite = factory.deleteOne(Sites);
