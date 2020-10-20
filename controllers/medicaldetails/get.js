const { isEmpty } = require("lodash");
const MedicalDetails = require("../../models/medicaldetails");

const get = async (req, res) => {
  try {
    const medicaldetail = await MedicalDetails.findOne({ _id: req.params.id, isDeleted: false }).populate("doctorId", "name");

    if (isEmpty(medicaldetail)) {
      return res.status(404).json({
        success: false,
        error: "Not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: medicaldetail
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { get }