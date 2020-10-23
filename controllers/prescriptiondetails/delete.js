const { isEmpty } = require("lodash");
const Prescriptiondetails = require("../../models/prescriptiondetails");

const _delete = async (req, res) => {
    try {
        const deletedPrescriptiondetails = await Prescriptiondetails.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (isEmpty(deletedPrescriptiondetails)) {
            return res.status(406).json({
                success: false,
                error: "Deleted failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedPrescriptiondetails
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { _delete }