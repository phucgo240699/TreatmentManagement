const Departments = require("../../../models/departments")

const removePatient = async (req, res) => {
  try {
    const department = await Departments.findOne({ _id: req.params.id, isDeleted: false })
    
    department.queue = department.queue.filter((patient) => {
      return patient._id != req.params.patientId
    })

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

module.exports = { removePatient }