const { isEmpty } = require("lodash");
const Prescriptionbill = require("../../models/prescriptionbills");

const get = async (req, res) => {
  try {
    const prescriptionbill = await Prescriptionbill.findOne({ _id: req.params.id, isDeleted: false }).populate("pharmacistId", "name");

    if (isEmpty(prescriptionbill)) {
        return res.status(404).json({
            success: false,
            error: "Not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: prescriptionbill
    });
} catch (error) {
    return res.status(500).json({ success: false, error: error.message });
}
}

module.exports = { get }