const { pick } = require("lodash");
const { startSession } = require("mongoose");
const { abortTransactions, commitTransactions } = require("../../services/transaction");
const MedicalRecord = require("../../models/medicalrecords");

const update = async (req, res) => {
  let sessions = [];
    try {
        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);

        const updateMedicalRecord = await MedicalRecord.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            {
                ...pick(
                    req.body,
                    "patientId",
                    "reason"
                )
            },
            { session, new: true }
        );

        if (isEmpty(updateMedicalRecord)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Updated failed"
            });
        }
        
        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: updateMedicalRecord
        });
    } catch (error) {
        await abortTransactions(sessions);
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { update }