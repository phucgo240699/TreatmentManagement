const { pick } = require("lodash");
const Medicine = require("../../models/medicines");
const getAll = async (req, res) => {
  const page = Number(req.query.page); // page index
  const limit = Number(req.query.limit); // limit docs per page
  try {
    const categoryId = req.body.medicinecategoriesId;

    let medicines;
    let query = {
      medicinecategoriseId: categoryId,
      ...pick(req.body, "name", "quantity", "price", "brand", "unit"),
      isDeleted: false
    };

    if (!page || !limit) {
      medicines = await Medicine.find(query)
        .select(
          "name price quantity brand medicinecategoriesId unit"
        )
        .populate("medicinecategoriesId", "name");
    } else {
      medicines = await Medicine.find(query)
        .select(
          "name price quantity brand medicinecategoriesId unit"
        )
        .populate("medicinecategoriesId", "name")
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getAll }