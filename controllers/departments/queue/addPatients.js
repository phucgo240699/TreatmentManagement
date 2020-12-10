const Departments = require("../../../models/departments")
const { isEmpty } = require("lodash")

const addPatients = async (req, res) => {
  try {
    const doc = await Departments.findOne({ _id: req.params.id, isDeleted: false })
    const medicalrecordIds = req.body.medicalrecordIds

    if (medicalrecordIds === undefined) {
      return res.status(406).json({
        success: false,
        error: "Not enough information"
      });
    }

    doc.queue.push(medicalrecordIds)
    await doc.save()


    const query = { _id: req.params.id, isDeleted: false }
    let docs;
    docs = await Departments.find(query)
      .select("queue _id")
      .populate({ path: "queue", populate: { path: "patientId" }, select: ["patientId", "reason", "status"] })

    return res.status(200).json({
      success: true,
      data: docs
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { addPatients }