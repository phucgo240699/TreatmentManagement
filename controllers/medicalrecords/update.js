const { pick } = require("lodash");
const MedicalRecord = require("../../models/medicalrecords");

const update = async (req, res) => {
    try {

        const updateMedicalRecord = await MedicalRecord.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            {
                ...pick(
                    req.body,
                    "patientId",
                    "reason"
                )
            },
            { new: true }
        );

        if (isEmpty(updateMedicalRecord)) {
            return res.status(406).json({
                success: false,
                error: "Updated failed"
            });
        }
        
        // Done

        return res.status(200).json({
            success: true,
            data: updateMedicalRecord
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { update }