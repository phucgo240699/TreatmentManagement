const Medicine = require("../../models/medicines");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");

const create = async (req, res) => {
    let sessions = [];
    try {
        const name = req.body.name;
        const price = req.body.price;
        const quantity = req.body.quantity;
        const brand = req.body.brand;
        const categoryId = req.body.medicinecategoriesId;
        const unit = req.body.unit;
        // Check not enough property
        if (isEmpty(name) || isEmpty(brand) || isEmpty(categoryId) || !price || !quantity || isEmpty(unit)) {
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
        const newMedicine = await Medicine.create(
            [
                {
                    ...pick(
                        req.body,
                        "name",
                        "unit",
                        "price",
                        "quantity",
                        "brand",
                        "medicineId",
                        "medicinecategoriesId",
                        "unit"
                    )
                }
            ],
            { session: session }
        );

        if (isEmpty(newMedicine)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }

        // Check exist
        const oldMedicine = await Medicine.find({
            name: name,
            isDeleted: false
        }, null, { session });


        if (oldMedicine.length > 1) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "This Medicine Category is already exist"
            });
        }
        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: newMedicine[0]
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