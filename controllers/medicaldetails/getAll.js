const { pick } = require("lodash");
const MedicalDetails = require("../../models/medicaldetails");
const getAll = async (req, res) => {
  const page = Number(req.query.page); // page index
  const limit = Number(req.query.limit); // limit docs per page
  try {
    let medicaldetails;
    let query = {
      ...pick(req.body, "medicalrecordId", "doctorId", "prescriptionId"),
      isDeleted: false
    };

    if (!page || !limit) {
      medicaldetails = await MedicalDetails.find(query)
        .select(
          "medicalrecordId doctorId prescriptionId images result"
        )
        .populate("doctorId", "name");
    } else {
      medicaldetails = await MedicalDetails.find(query)
        .select(
          "medicalrecordId doctorId prescriptionId images result"
        )
        .populate("doctorId", "name")
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({ success: true, data: medicaldetails });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getAll }