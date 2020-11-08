const { pick } = require("lodash");
const MedicalRecord = require("../../models/medicalrecords");
const getAll = async (req, res) => {
  const page = Number(req.query.page); // page index
  const limit = Number(req.query.limit); // limit docs per page
  try {
    let medicalrecords;
    let query = {
      ...pick(req.body, "patientId", "reason"),
      isDeleted: false
    };

    if (!page || !limit) {
      medicalrecords = await MedicalRecord.find(query)
        .select(
          "patientId reason status"
        )
        .populate("patientId","name");
    } else {
      medicalrecords = await MedicalRecord.find(query)
        .select(
          "patientId reason status"
        )
        .populate("patientId","name")
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({ success: true, data: medicalrecords });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getAll }