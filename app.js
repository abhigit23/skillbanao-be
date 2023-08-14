require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cors = require("cors");

const connectDB = require("./db/connect");

const userRouter = require("./routes/userRoutes");
const proRouter = require("./routes/proRoutes");

const notFoundMiddleware = require("./middleware/routeNotFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

app.use(cors());

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use("/user", userRouter);
app.use("/professional", proRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    app.listen(port, () =>
      console.log(`Server is listening to port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
