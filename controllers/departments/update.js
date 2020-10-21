const Departments = require("../../models/departments")

const { handleBody } = require("./handleBody")

const update = async (req, res) => {
  let sessions = []
  try {
    const queryUpdate = { _id: req.params.id, isDeleted: false }

    // Handle data
    const { error, body} = handleBody(req.body) // for newDoc
    if (error) {
      return res.status(406).json({
        success: false,
        error: error
      })
    }

    // Access DB
    const updated = await Departments.findOneAndUpdate(
      queryUpdate,
      body,
      { new: true }
    )
    
    return res.status(200).json({
      success: true,
      data: updated
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { update }