const Prescriptionbill = require("../../models/prescriptionbills");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");

const create = async (req, res) => {
    let sessions = [];
    try {
        const prescriptionId = req.body.prescriptionId;
        const pharmacistId = req.body.pharmacistId;
        const into_money = req.body.into_money;
        // Check not enough property
        if (isEmpty(prescriptionId) || isEmpty(pharmacistId)) {
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
        const newPrescriptionbill = await Prescriptionbill.create(
            [
                {
                    ...pick(
                        req.body,
                        "prescriptionId",
                        "pharmacistId",
                        "into_money"
                    )
                }
            ],
            { session: session }
        );

        if (isEmpty(newPrescriptionbill)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }
        // Check exist


        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: newPrescriptionbill[0]
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