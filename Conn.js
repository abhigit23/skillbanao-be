require("dotenv").config();

// import { connect, Schema, model } from "mongoose";
const { connect } = require("mongoose");

// Connect to MongoDB Compass
connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
