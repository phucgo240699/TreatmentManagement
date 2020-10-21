const { pick } = require("lodash");
const Prescription = require("../../models/prescriptions");

const update = async (req, res) => {
    try {
        const updatePrescription = await Prescription.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            {
                ...pick(
                    req.body,
                    "patientId",
                    "doctorId",
                    "conclude"
                )
            },
            { new: true }
        );

        if (isEmpty(updatePrescription)) {
            return res.status(406).json({
                success: false,
                error: "Updated failed"
            });
        }
        
        // Done

        return res.status(200).json({
            success: true,
            data: updatePrescription
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { update }