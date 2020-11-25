const { pick } = require("lodash");
const Prescriptionbilldetails = require("../../models/prescriptionbilldetails");

const getAll = async (req, res) => {
  const page = Number(req.query.page); // page index
  const limit = Number(req.query.limit); // limit docs per page
  try {
    let Prescriptionbilldetail;
    let query = {
      ...pick(req.body, "prescriptionbillId", "medicineId", "quantity"),
      isDeleted: false
    };

    if (!page || !limit) {
      Prescriptionbilldetail = await Prescriptionbilldetails.find(query)
        .select(
          "prescriptionbillId medicineId quantity createdAt"
        )
        .populate("medicineId");
    } else {
      Prescriptionbilldetail = await Prescriptionbilldetails.find(query)
        .select(
          "prescriptionbillId medicineId quantity createdAt"
        )
        .populate("medicineId")
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({ success: true, data: Prescriptionbilldetail });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getAll }