const { pick } = require("lodash");
const Prescription = require("../../models/prescriptions");
const getAll = async (req, res) => {
  const page = Number(req.query.page); // page index
  const limit = Number(req.query.limit); // limit docs per page
  try {
    let Prescriptions;
    let query = {
      ...pick(req.body, "patientId", "doctorId", "conclude"),
      isDeleted: false
    };

    if (!page || !limit) {
      Prescriptions = await Prescription.find(query)
        .select(
          "patientId doctorId conclude"
        )
        .populate("patientId", "name").populate("doctorId", "name");
    } else {
      Prescriptions = await Prescription.find(query)
        .select(
          "patientId doctorId conclude"
        )
        .populate("patientId", "name").populate("doctorId", "name")
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({ success: true, data: Prescriptions });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getAll }