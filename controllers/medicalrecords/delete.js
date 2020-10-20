const { isEmpty } = require("lodash");
const MedicalRecord = require("../../models/medicalrecords");

const _delete = async (req, res) => {
    try {
        const deletedMedicalRecord = await MedicalRecord.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (isEmpty(deletedMedicalRecord)) {
            return res.status(406).json({
                success: false,
                error: "Deleted failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedMedicalRecord
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { _delete }