const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const sanitizeBody = require('../middleware/sanitizeBody.js')

router.use('/', sanitizeBody);

router.get("/", async (req, res) => {
  const courses = await Course.find();
  //returns a promise..await and store the results in local variable
  res.send({
    data: courses.map((course) =>
      formatResponseData("courses", course.toObject())
    ),
  });
});

router.post("/", async (req, res) => {
  let attributes = req.sanitizeBody;
  delete attributes._id; // if it exists

  let newCourse = new Course(attributes);
  await newCourse.save();

  res
    .status(201)
    .json({ data: formatResponseData("courses", newCourse.toObject()) });
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("owner");
    if (!course) {
      throw new Error("Resource not found");
    }

    res.json({ data: formatResponseData("courses", course.toObject()) });
  } catch (err) {}
  sendResourceNotFound(req, res);
});

router.patch("/:id", async (req, res) => {
  try {
    const { _id, ...otherAttributes } = req.sanitizeBody;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes },

      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      throw new Error("Resource not found");
    }

    res.json({ data: formatResponseData("courses", course.toObject()) });
  } catch (err) {}
  sendResourceNotFound(req, res);
});

router.put("/:id", async (req, res) => {
  try {
    const { _id, ...otherAttributes } = req.sanitizeBody;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes },

      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    );

    if (!course) {
      throw new Error("Resource not found");
    }

    res.json({ data: formatResponseData("courses", course.toObject()) });
  } catch (err) {}
  sendResourceNotFound(req, res);
});

router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndRemove(req.params.id);
    if (!course) throw new Error("Resource not found");
    res.send({ data: formatResponseData("courses", course.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g.
 * @param {Object} resource An instance object from that collection
 * @returns
 */
function formatResponseData(type, resource) {
  const { id, ...attributes } = resource;
  return { type, id: _id, attributes };
}

function sendResourceNotFound(req, res) {
  res.status(404).send({
    errors: [
      {
        status: "404",
        title: "Resource does not exist",
        description: `We could not find a course with id: ${req.params.id}`,
      },
    ],
  });
}

module.exports = router;
