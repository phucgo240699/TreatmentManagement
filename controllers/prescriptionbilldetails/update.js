const { pick } = require("lodash");
const { startSession } = require("mongoose");
const { abortTransactions, commitTransactions } = require("../../services/transaction");
const Prescriptiondetails = require("../../models/prescriptiondetails");

const update = async (req, res) => {
    let sessions = [];
    try {
        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);

        const updatePrescriptiondetail = await Prescriptiondetails.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            {
                ...pick(
                    req.body,
                    "medicineId",
                    "quantity"
                )
            },
            { session, new: true }
        );

        if (isEmpty(updatePrescriptiondetail)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Updated failed"
            });
        }

        // Check exist
        if (req.body.medicineId) {
            let isChangemedicine = true;
            const [prescriptiondetails, beforeUpdated] = await Promise.all([
                Prescriptiondetails.find({ medicineId: req.body.medicineId, isDeleted: false }, null, { session }),
                Prescriptiondetails.findOne({
                    _id: req.params.id,
                    isDeleted: false
                })
            ]);

            if (beforeUpdated.medicineId === updatePrescriptiondetail.medicineId) {
                isChangemedicine = false;
            }

            if (prescriptiondetails.length > 1 && isChangemedicine) {
                await abortTransactions(sessions);
                return res.status(409).json({
                    success: false,
                    error: "This medicine is already exist"
                });
            }
        }

        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: updatePrescriptiondetail
        });
    } catch (error) {
        await abortTransactions(sessions);
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { update }