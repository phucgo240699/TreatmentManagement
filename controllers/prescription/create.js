const Prescription = require("../../models/prescriptions");
const { isEmpty, pick } = require("lodash");

const create = async (req, res) => {
    try {
        const medicalrecordId = req.body.medicalrecordId;
        const doctorId = req.body.doctorId;
        const conclude = req.body.conclude;
        // Check not enough property
        if (isEmpty(medicalrecordId) || isEmpty(doctorId) || isEmpty(conclude)) {
            return res.status(406).json({
                success: false,
                error: "Not enough property"
            });
        }

        //Create
        const newPrescription = await Prescription.create(
            [
                {
                    ...pick(
                        req.body,
                        "medicalrecordId",
                        "doctorId",
                        "conclude"
                    )
                }
            ]
        );

        if (isEmpty(newPrescription)) {
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }

        // Done

        return res.status(200).json({
            success: true,
            data: newPrescription[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { create }