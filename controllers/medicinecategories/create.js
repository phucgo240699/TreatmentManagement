const MedicineCategories = require("../../models/medicinecategories");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");

const create = async (req, res) => {
    let sessions = [];
    try {
        const name = req.body.name;
        // Check not enough property
        if (isEmpty(name)) {
            return res.status(406).json({
                success: false,
                error: "Not enough property"
            });
        }

        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);

        const newMedicineCategories = await MedicineCategories.create(
            [
                {
                    ...pick(
                        req.body,
                        "name"
                    )
                }
            ],
            { session: session }
        );

        if (isEmpty(newMedicineCategories)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }

        // Check exist
        const oldMedicineCategories = await MedicineCategories.find({
            name: name,
            isDeleted: false
        }, null, { session });


        if (oldMedicineCategories.length > 1) {
            await abortTransactions(sessions);
            return res.status(409).json({
                success: false,
                error: "This Medicine Category is already exist"
            });
        }


        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: newMedicineCategories[0]
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