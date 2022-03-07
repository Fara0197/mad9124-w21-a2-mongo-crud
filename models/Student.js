"use strict";

const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 64 },
  lastName: { type: String, required: true, maxlength: 64 },
  nickName: { type: String, required: false, maxlength: 64 },
  email: { type: String, required: true, maxlength: 512 },
});
//use schema to create model class
const Model = mongoose.model("Student", schema);

module.exports = Model;
