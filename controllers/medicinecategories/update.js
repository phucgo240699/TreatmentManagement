const { pick } = require("lodash");
const { startSession } = require("mongoose");
const { abortTransactions, commitTransactions } = require("../../services/transaction");
const MedicineCategories = require("../../models/medicinecategories");

const update = async (req, res) => {
    let sessions = [];
    try {
        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);

        const updateMedicineCategories = await MedicineCategories.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            {
                ...pick(
                    req.body,
                    "name",
                )
            },
            { session, new: true }
        );

        if (isEmpty(updateMedicineCategories)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Updated failed"
            });
        }

        // Check exist
        if (req.body.name) {
            let isChangeName = true;
            const [medicinecategories, beforeUpdated] = await Promise.all([
                MedicineCategories.find({ name: req.body.name, isDeleted: false }, null, { session }),
                MedicineCategories.findOne({
                    _id: req.params.id,
                    isDeleted: false
                })
            ]);

            if (beforeUpdated.name === updateMedicineCategories.name) {
                isChangeName = false;
            }

            if (medicinecategories.length > 1 && isChangeName) {
                await abortTransactions(sessions);
                return res.status(409).json({
                    success: false,
                    error: "This name is already exist"
                });
            }
        }

        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: updateMedicineCategories
        });
    } catch (error) {
        await abortTransactions(sessions);
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { update }