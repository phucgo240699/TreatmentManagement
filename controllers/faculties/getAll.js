const { pick } = require("lodash");
const Faculties = require("../../models/faculties")

const getAll = async (req, res) => {
  const page = Number(req.query.page) // page index
  const limit = Number(req.query.limit) // limit docs per page

  try {
    let query = {
      ...pick(req.body, "name"),
      isDeleted: false
    };
    
    let docs;
    if (!page || !limit) {
      docs = await Faculties.find(query)
    }
    else {
      docs = await Faculties.find(query)
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

module.exports = { getAll }