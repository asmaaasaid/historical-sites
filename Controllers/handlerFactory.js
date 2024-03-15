const asyncHandler = require("express-async-handler");
const Sites = require("../Models/sitesModel");
const ApiError = require("../shared/ErrorsAPI");
const sequanceModel = require("../Models/sequanceModel");
const ApiFeatures = require("../shared/apiFeatures");



exports.deleteOne = (Model) =>
asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
  
    if (!document) {
      return next(new ApiError(`There is no site for this id ${id}`, 404));
    }

    document.remove();
    res.status(200).json({ message: " Deleted successfully" });
  });
  

