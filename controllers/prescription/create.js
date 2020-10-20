const Prescription = require("../../models/prescriptions");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");

const create = async (req, res) => {
    let sessions = [];
    try {
        const patientId = req.body.patientId;
        const doctorId = req.body.doctorId;
        const conclude = req.body.conclude;
        // Check not enough property
        if (isEmpty(patientId) || isEmpty(doctorId) || isEmpty(conclude)) {
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
        const newPrescription = await Prescription.create(
            [
                {
                    ...pick(
                        req.body,
                        "patientId",
                        "doctorId",
                        "conclude"
                    )
                }
            ],
            { session: session }
        );

        if (isEmpty(newPrescription)) {
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
            data: newPrescription[0]
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