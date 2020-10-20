const Prescriptiondetails = require("../../models/prescriptiondetails");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");

const create = async (req, res) => {
    let sessions = [];
    try {
        const prescriptionId = req.body.prescriptionId;
        const medicineId = req.body.medicineId;
        const quantity = req.body.quantity;
        // Check not enough property
        if (isEmpty(prescriptionId) || isEmpty(medicineId) || !quantity) {
            return res.status(406).json({
                success: false,
                error: "Not enough property"
            });
        }

        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);

        //Create
        const newPrescriptiondetails = await Prescriptiondetails.create(
            [
                {
                    ...pick(
                        req.body,
                        "prescriptionId",
                        "medicineId",
                        "quantity"
                    )
                }
            ],
            { session: session }
        );

        if (isEmpty(newPrescriptiondetails)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }

        // Check exist
        const oldPrescriptiondetails = await Prescriptiondetails.find({
            prescriptionId: prescriptionId,
            medicineId: medicineId,
            isDeleted: false
        }, null, { session });


        if (oldPrescriptiondetails.length > 1) {
            await abortTransactions(sessions);
            return res.status(409).json({
                success: false,
                error: "This Prescriptiondetails is already exist"
            });
        }


        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: newPrescriptiondetails[0]
        });
    } catch (error) {
        await abortTransactions(sessions);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { create }