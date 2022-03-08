// Don't forget to use NPM to install Express and Mongoose.
"use strict";

const courseRouter = require("./routes/courses.js");
const studentRouter = require("./routes/students.js");
require('./startup/database')() 

const debug = require('debug')('week7:db')
const morgan = require("morgan");
const express = require("express");
const sanitizeMongo = require('express-mongo-sanitize')


const app = express();
app.use(morgan("tiny"));
app.use(express.json());


app.use("/api/courses", courseRouter);
app.use("/api/students", studentRouter);
app.use(sanitizeMongo());

const port = process.env.PORT || 3030;
app.listen(port, () =>
  console.log(`HTTP server listening on port ${port} ...`)
);

