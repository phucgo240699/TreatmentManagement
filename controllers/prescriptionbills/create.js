const Prescriptionbill = require("../../models/prescriptionbills");
const { isEmpty, pick } = require("lodash");

const create = async (req, res) => {
    try {
        const pharmacistId = req.body.pharmacistId;
        const name = req.body.name;
        const conclude = req.body.conclude;
        const prescriptionId = req.body.prescriptionId;
        const into_money = req.body.into_money;
        // Check not enough property
        if (isEmpty(pharmacistId) || isEmpty(name) || isEmpty(conclude)) {
            return res.status(406).json({
                success: false,
                error: "Not enough property"
            });
        }

        //Create
        const newPrescriptionbill = await Prescriptionbill.create(
            [
                {
                    ...pick(
                        req.body,
                        "pharmacistId",
                        "into_money",
                        "name",
                        "conclude",
                        "prescriptionId"
                    )
                }
            ]
        );

        if (isEmpty(newPrescriptionbill)) {
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }
        // Done

        return res.status(200).json({
            success: true,
            data: newPrescriptionbill[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { create }