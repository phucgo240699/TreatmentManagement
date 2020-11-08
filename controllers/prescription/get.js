const { isEmpty } = require("lodash");
const Prescription = require("../../models/prescriptions");

const get = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ _id: req.params.id, isDeleted: false })
    .populate({ path: "medicalrecordId", populate: { path: "patientId" }, select: ["patientId"] })
    .populate("doctorId", "name");

    if (isEmpty(prescription)) {
      return res.status(406).json({
        success: false,
        error: "Not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { get }