const MedicalRecord = require("../../models/medicalrecords");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");

const create = async (req, res) => {
    let sessions = [];
    try {
        const patientId = req.body.patientId;
        const reason = req.body.reason;
        // Check not enough property
        if (isEmpty(patientId) || isEmpty(reason)) {
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
        const newMedicalRecord = await MedicalRecord.create(
            [
                {
                    ...pick(
                        req.body,
                        "patientId",
                        "reason"
                    )
                }
            ],
            { session: session }
        );

        if (isEmpty(newMedicalRecord)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }
        
        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: newMedicalRecord[0]
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