const { pick } = require("lodash");
const Prescriptionbill = require("../../models/prescriptionbills");
const getAll = async (req, res) => {
  const page = Number(req.query.page); // page index
  const limit = Number(req.query.limit); // limit docs per page
  try {
    let Prescriptionbills;
    let query = {
      ...pick(req.body, "pharmacistId", "into_money"),
      isDeleted: false
    };

    if (!page || !limit) {
      Prescriptionbills = await Prescriptionbill.find(query)
        .select(
          "pharmacistId into_money name conclude"
        )
        .populate("pharmacistId", "name");
    } else {
      Prescriptionbills = await Prescriptionbill.find(query)
        .select(
          "pharmacistId into_money name conclude"
        )
        .populate("patientId", "name")
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({ success: true, data: Prescriptionbills });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getAll }