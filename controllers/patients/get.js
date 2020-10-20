const { isEmpty } = require("lodash");
const Patient = require("../../models/patients");

const get = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, isDeleted: false });

    if (isEmpty(patient)) {
      return res.status(404).json({
        success: false,
        error: "Not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { get }