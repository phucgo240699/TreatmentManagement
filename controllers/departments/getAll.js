const { pick } = require("lodash");
const Departments = require("../../models/departments")

const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {
    let query = {
      ...pick(req.body, "facultyId"),
      isDeleted: false
    };

    let docs;
    if (!page || !limit) {
      docs = await Departments.find(query)
        .populate("facultyId", "name")
        .populate({ path: "queue", populate: { path: "patientId" }, select: ["patientId", "reason","status"] })
    }
    else {
      docs = await Departments.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .populate("facultyId", "name")
        .populate({ path: "queue", populate: { path: "patientId" }, select: ["patientId", "reason","status"] })
    }
    return res.status(200).json({
      success: true,
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { getAll }