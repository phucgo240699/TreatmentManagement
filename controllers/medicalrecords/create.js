const MedicalRecord = require("../../models/medicalrecords");
const { isEmpty, pick } = require("lodash");

const create = async (req, res) => {
    try {
        const patientId = req.body.patientId;
        const reason = req.body.reason;
        const status = req.body.status;
        // Check not enough property
        if (isEmpty(patientId) || isEmpty(reason) || isEmpty(status)) {
            return res.status(406).json({
                success: false,
                error: "Not enough property"
            });
        }
        //Create
        const newMedicalRecord = await MedicalRecord.create(
            [
                {
                    ...pick(
                        req.body,
                        "patientId",
                        "reason",
                        "status"
                    )
                }
            ]
        );

        if (isEmpty(newMedicalRecord)) {
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }
        
        // Done

        return res.status(200).json({
            success: true,
            data: newMedicalRecord[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { create }