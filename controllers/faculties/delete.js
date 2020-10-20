const { pick } = require('lodash')
const Faculties = require("../../models/Faculties")

const _delete = async (req, res) => {
  try {
    const queryDelete = { _id: req.params.id, isDeleted: false }

    const deleted = await Faculties.findOneAndUpdate(
        queryDelete,
        { isDeleted: true },
        { new: true }
      )
    
    // Deleted Successfully
    return res.status(200).json({
      success: true,
      data: deleted
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { _delete }