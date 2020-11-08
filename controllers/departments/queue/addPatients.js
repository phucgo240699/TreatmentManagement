const Departments = require("../../../models/departments")
const { isEmpty }= require("lodash")

const addPatients = async (req, res) => {
  try {
    const doc = await Departments.findOne({ _id: req.params.id, isDeleted: false })
    const medicalrecordIds = req.body.medicalrecordIds
    
    if ( medicalrecordIds === undefined ) {
      return res.status(406).json({
        success: false,
        error: "Not enough information"
      });
    }

    if ( Array.isArray(medicalrecordIds) == false ) {
      return res.status(406).json({
        success: false,
        error: "medicalrecordIds must be array"
      });
    }
    
    medicalrecordIds.forEach(patientId => {
      doc.queue.push(patientId)
    });

    await doc.save()

    return res.status(200).json({
      success: true,
      data: doc
    })
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { addPatients }