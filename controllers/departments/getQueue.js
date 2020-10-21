const Departments = require("../../models/departments")

const getQueue = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {
    const query = { _id: req.params.id, isDeleted: false }
    let docs;
    if (!page || !limit) {
      docs = await Departments.find(query)
      .select("queue -_id")
      .populate("queue")
    }
    else {
      docs = await Departments.find(query)
      .select("queue -_id")
      .populate("queue._id")
      .skip(limit * (page - 1))
      .limit(limit)
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

module.exports = { getQueue }