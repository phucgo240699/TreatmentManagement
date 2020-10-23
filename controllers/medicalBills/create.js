const MedicalBills = require("../../models/medicalBills")
const { handleBody } = require("./handleBody")


const create = async (req, res) => {
  try {
    // Check permission
    if (["admin", "staff"].include(req.user.role) === false) {
      return res.status(406).json({
        success: false,
        error: "Not allow"
      })
    }

    // Handle data
    const { error, body} = handleBody(req.body) // for newDoc
    if (error) {
      return res.status(406).json({
        success: false,
        error: error
      })
    }

    // Access DB
    const newDoc = await MedicalBills.create(body)

    // Success
    return res.status(200).json({
      success: true,
      data: newDoc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { create }