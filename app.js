// Don't forget to use NPM to install Express and Mongoose.
"use strict";

const courseRouter = require("./routes/courses.js");
const studentRouter = require("./routes/students.js");
const mongoose = require("mongoose");
const morgan = require("morgan");
const express = require("express");
const app = express();

app.use(morgan("tiny"));
app.use(express.json());


app.use("/api/courses", courseRouter);
app.use("/api/students", studentRouter);

const port = process.env.PORT || 3030;
app.listen(port, () =>
  console.log(`HTTP server listening on port ${port} ...`)
);

mongoose
  .connect("mongodb://localhost:27017/mad9124", {
    useNewUrlParser: true,
  })
  //returns a promise
  .then(() => console.log("Connected to MongoDB ..."))
  .catch((err) => {
    console.error("Problem connecting to MongoDB ...", err.message);
    process.exit(1);
   
  });