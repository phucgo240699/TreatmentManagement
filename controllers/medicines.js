const Medicine = require("../model/medicines");
const { isEmpty, pick } = require("lodash");
const { model, startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../services/transaction");
const { json } = require("body-parser");

exports.create = async (req, res, next) => {
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
        });


        if (oldMedicine.length > 0) {
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
            data: newMedicine[0]
        });
    } catch (error) {
        await abortTransactions(sessions);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.get = async (req, res, next) => {
    try {
        const medicine = await Medicine.findOne({ _id: req.params.id, isDeleted: false }).populate("medicinecategoriesId", "name");

        if (isEmpty(medicine)) {
            return res.status(404).json({
                success: false,
                error: "Not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: medicine
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAll = async (req, res, next) => {
    const page = Number(req.query.page); // page index
    const limit = Number(req.query.limit); // limit docs per page
    try {
        const categoryId = req.body.medicinecategoriesId;

        let medicine;
        let query = {
            medicinecategoriseId: categoryId,
            ...pick(req.body, "name", "quantity", "price", "brand", "unit"),
            isDeleted: false
        };

        if (!page || !limit) {
            medicine = await Medicine.find(query)
                .select(
                    "name price quantity brand medicinecategoriesId unit"
                )
                .populate("medicinecategoriesId", "name");
        } else {
            medicine = await Medicine.find(query)
                .select(
                    "name price quantity brand medicinecategoriesId unit"
                )
                .populate("medicinecategoriesId", "name")
                .skip(limit * (page - 1))
                .limit(limit);
        }

        return res.status(200).json({ success: true, data: medicine });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.update = async (req, res, next) => {
    let sessions = [];
    try {
        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);

        const updateMedicine = await Medicine.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            {
                ...pick(
                    req.body,
                    "name",
                    "price",
                    "quantity",
                    "brand",
                    "medicineId",
                    "unit"
                )
            },
            { session, new: true }
        );

        if (isEmpty(updateMedicine)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Updated failed"
            });
        }

        if (Number(req.body.quantity) < 0) {
            await abortTransactions(session);
            return res.startSession(406), json({
                success: false,
                error: "Quantity is invalid"
            })
        }

        if (Number(req.body.price) < 0) {
            await abortTransactions(session);
            return res.startSession(406), json({
                success: false,
                error: "Price is invalid"
            })
        }

        // Check exist
        if (req.body.name) {
            let isChangeName = true;
            const [medicines, beforeUpdated] = await Promise.all([
                medicines.find({ name: req.body.name, isDeleted: false }),
                medicines.findOne({
                    _id: req.params.id,
                    isDeleted: false
                })
            ]);

            if (beforeUpdated.name === updateMedicine.name) {
                isChangeName = false;
            }

            if (medicines.length > 0 && isChangeName) {
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
            data: updateMedicine
        });
    } catch (error) {
        await abortTransactions(sessions);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const deletedMedicine = await Medicine.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (isEmpty(deletedMedicine)) {
            return res.status(406).json({
                success: false,
                error: "Deleted failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedMedicine
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};