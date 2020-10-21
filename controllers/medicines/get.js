const { isEmpty } = require("lodash");
const Medicine = require("../../models/medicines");

const get = async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ _id: req.params.id, isDeleted: false }).populate("medicinecategoriesId", "name");

    if (isEmpty(medicine)) {
      return res.status(406).json({
        success: false,
        error: "Not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { get }