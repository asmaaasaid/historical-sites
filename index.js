const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: ".env" });
const path = require("path");
const ApiError = require("./shared/ErrorsAPI");
const dataConnect = require("./Config/dbConnection");
const categoryRoute = require("./Routes/categoryRoutes");
const errorGlobal = require("./middleware/errorHandling");
const subCategoryRoute = require("./Routes/subCategoryRoutes");
const sitesRoute = require("./Routes/sitesRoute");
const userRoute = require("./Routes/userRoute");
const authRoute = require("./Routes/authRoute");
const reviewRoute = require('./Routes/reviewRoute');
const wishlistRoute = require('./Routes/wishlistRoute')
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');




dataConnect();

const app = express();

app.use(cors());


//MiddleWare
app.use(express.json({limit: '50kb'} ));

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}



// protect security from nosql attacks injection
app.use(mongoSanitize());
// protect security from xss 
app.use(helmet());



// security for limiting the requestes
// Limit each IP to 100 requests in `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 50,
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

//rate limiting middleware to all requests
app.use('/api', limiter);


// Middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp({
    whitelist: [
      'ratingAverage',
      'ratingQuantity'],
 })
);




//all main routes
app.use("/api/categories", categoryRoute);
app.use("/api/subCategories", subCategoryRoute);
app.use("/api/sites", sitesRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/wishlist", wishlistRoute)



app.all("*", (req, res, next) => {
  next(new ApiError(` Can't find this route: ${req.originalUrl}`, 400));
});

//handling global error in express
app.use(errorGlobal);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}`);
});

// Gobal handling for err that can listen to any rejection event outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
