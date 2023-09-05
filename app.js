require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");

const cors = require("cors");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const connectDB = require("./db/connect");

const userRouter = require("./routes/userRoutes");
const proRouter = require("./routes/proRoutes");
const chatRoute = require("./routes/chatRoutes");
const blogRoute = require("./routes/blogRoutes");
const couponRoute = require("./routes/couponRoutes");
const authRoute = require("./routes/authRoute");
const detailRoute = require("./routes/detailRoute");

const notFoundMiddleware = require("./middleware/routeNotFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//   });
// });

app.use("/user", userRouter);
app.use("/professional", proRouter);
app.use(
  "/chat",
  (req, res, next) => {
    req.socketConfig = io;
    next();
  },
  chatRoute
);
app.use("/blog", blogRoute);
app.use("/coupon", couponRoute);
app.use("/auth", authRoute);
app.use("/website", detailRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    httpServer.listen(port, () =>
      console.log(`Server is listening to port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
