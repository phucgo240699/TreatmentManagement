const { pick } = require("lodash");
const Prescriptiondetails = require("../../models/prescriptiondetails");
const getAll = async (req, res) => {
  const page = Number(req.query.page); // page index
  const limit = Number(req.query.limit); // limit docs per page
  try {
    let prescriptiondetails;
    let query = {
      ...pick(req.body, "prescriptionId", "medicineId", "quantity"),
      isDeleted: false
    };

    if (!page || !limit) {
      prescriptiondetails = await Prescriptiondetails.find(query)
        .select(
          "prescriptionId medicineId quantity"
        )
        .populate({ path: "medicineId" });
    } else {
      prescriptiondetails = await Prescriptiondetails.find(query)
        .select(
          "prescriptionId medicineId quantity"
        )
        .populate({ path: "medicineId"})
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({ success: true, data: prescriptiondetails });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getAll }