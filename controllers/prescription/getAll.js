const { pick } = require("lodash");
const Prescription = require("../../models/prescriptions");
const getAll = async (req, res) => {
  const page = Number(req.query.page); // page index
  const limit = Number(req.query.limit); // limit docs per page
  try {
    let Prescriptions;
    let query = {
      ...pick(req.body, "medicalrecordId", "doctorId", "conclude"),
      isDeleted: false
    };

    if (!page || !limit) {
      Prescriptions = await Prescription.find(query)
        .select(
          "medicalrecordId doctorId conclude createdAt"
        )
        .populate({ path: "medicalrecordId", populate: { path: "patientId" }, select: ["patientId"] })
        .populate("doctorId");
    } else {
      Prescriptions = await Prescription.find(query)
        .select(
          "medicalrecordId doctorId conclude createdAt"
        )
        .populate({ path: "medicalrecordId", populate: { path: "patientId" }, select: ["patientId"] })
        .populate("doctorId")
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({ success: true, data: Prescriptions });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getAll }