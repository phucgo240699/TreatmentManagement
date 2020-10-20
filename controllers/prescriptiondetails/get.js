const { isEmpty } = require("lodash");
const Prescriptiondetails = require("../../models/prescriptiondetails");

const get = async (req, res) => {
  try {
    const prescriptiondetail = await Prescriptiondetails.findOne({ _id: req.params.id, isDeleted: false }).populate("prescriptionId", "name").populate("medicineId", "name");

    if (isEmpty(prescriptiondetail)) {
        return res.status(404).json({
            success: false,
            error: "Not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: prescriptiondetail
    });
} catch (error) {
    return res.status(500).json({ success: false, error: error.message });
}
}

module.exports = { get }