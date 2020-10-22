const Departments = require("../../../models/departments")

const cleanPatientQueue = async (req, res) => {
  try {
    const department = await Departments.findOne({ _id: req.params.id, isDeleted: false })
    
    department.queue = []

    await department.save()

    return res.status(200).json({
      success: true,
      data: department.queue
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { cleanPatientQueue }