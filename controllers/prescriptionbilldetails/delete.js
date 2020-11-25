const { isEmpty } = require("lodash");
const Prescriptionbilldetails = require("../../models/prescriptionbilldetails");

const _delete = async (req, res) => {
    try {
        const deletedPrescriptionbilldetails = await Prescriptionbilldetails.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (isEmpty(deletedPrescriptionbilldetails)) {
            return res.status(406).json({
                success: false,
                error: "Deleted failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedPrescriptionbilldetails
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { _delete }