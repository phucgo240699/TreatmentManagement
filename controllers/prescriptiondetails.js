const Prescriptiondetails = require("../models/prescriptiondetails");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../services/transaction");
const { json } = require("body-parser");

exports.create = async (req, res, next) => {
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
        });


        if (oldPrescriptiondetails.length > 0) {
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
};

exports.get = async (req, res, next) => {
    try {
        const prescriptiondetail = await Prescriptiondetails.findOne({ _id: req.params.id, isDeleted: false }).populate("prescriptionId", "name").populate("medicineId", "name");

        if (isEmpty(prescriptiondetail)) {
            return res.status(404).json({
                success: false,
                error: "Not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: prescriptiondetail
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAll = async (req, res, next) => {
    const page = Number(req.query.page); // page index
    const limit = Number(req.query.limit); // limit docs per page
    try {
        let prescriptiondetails;
        let query = {
            ...pick(req.body, "prescriptionId", "medicineId", "quantity"),
            isDeleted: false
        };

        if (!page || !limit) {
            prescriptiondetails = await Prescriptiondetails.find(query)
                .select(
                    "medicineId quantity"
                )
                .populate({ path: "medicineId", select: ["price", "name"] });
        } else {
            prescriptiondetails = await Prescriptiondetails.find(query)
                .select(
                    "medicineId quantity"
                )
                .populate({ path: "medicineId", select: ["price", "name"] })
                .skip(limit * (page - 1))
                .limit(limit);
        }

        return res.status(200).json({ success: true, data: prescriptiondetails });
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
                Prescriptiondetails.find({ medicineId: req.body.medicineId, isDeleted: false }),
                Prescriptiondetails.findOne({
                    _id: req.params.id,
                    isDeleted: false
                })
            ]);

            if (beforeUpdated.medicineId === updatePrescriptiondetail.medicineId) {
                isChangemedicine = false;
            }

            if (prescriptiondetails.length > 0 && isChangemedicine) {
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
};

exports.delete = async (req, res, next) => {
    try {
        const deletedPrescriptiondetails = await Prescriptiondetails.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (isEmpty(deletedPrescriptiondetails)) {
            return res.status(406).json({
                success: false,
                error: "Deleted failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedPrescriptiondetails
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};