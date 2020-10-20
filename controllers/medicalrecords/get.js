const { isEmpty } = require("lodash");
const MedicalRecord = require("../../models/medicalrecords");

const get = async (req, res) => {
  try {
    const medicalrecord = await MedicalRecord.findOne({ _id: req.params.id, isDeleted: false }).populate("patientId","name");

    if (isEmpty(medicalrecord)) {
      return res.status(404).json({
        success: false,
        error: "Not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: medicalrecord
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { get }