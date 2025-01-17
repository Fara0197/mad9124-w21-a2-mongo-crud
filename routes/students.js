const express = require("express");
const router = express.Router();
const Student = require("../models/Student.js");
const sanitizeBody = require('../middleware/sanitizeBody.js')

router.use('/', sanitizeBody);


router.get("/", async (req, res) => {
  const students = await Student.find();
  res.send({
    data: students.map((student) =>
      formatResponseData("students", student.toObject())
    ),
  });
});

router.post("/", async (req, res) => {
  let attributes = req.sanitizeBody;
  delete attributes._id; // if it exists

  let newStudent = new Student(attributes);
  await newStudent.save();

  res
    .status(201)
    .json({ data: formatResponseData("students", newStudent.toObject()) });
});

//populate related reference..finds owner.. sees ref to owner ..grab student object and imbed as part of return data
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("course");
    if (!student) {
      throw new Error("Resource not found");
    }

    res.json({ data: formatResponseData("students", student.toObject()) });
  } catch (err) {}
  sendResourceNotFound(req, res);
});

router.patch("/:id", async (req, res) => {
  try {
    const { _id, ...otherAttributes } = req.sanitizeBody;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes },

      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      throw new Error("Resource not found");
    }

    res.json({ data: formatResponseData("students", student.toObject()) });
  } catch (err) {}
  sendResourceNotFound(req, res);
});

router.put("/:id", async (req, res) => {
  try {
    const { _id, ...otherAttributes } = req.sanitizeBody;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes },

      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    );

    if (!student) {
      throw new Error("Resource not found");
    }

    res.json({ data: formatResponseData("students", student.toObject()) });
  } catch (err) {}
  sendResourceNotFound(req, res);
});

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.id);
    if (!student) throw new Error("Resource not found");
    res.send({ data: formatResponseData("students", student.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. 'courses'
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
        description: `We could not find a owner with id: ${req.params.id}`,
      },
    ],
  });
}

module.exports = router;
