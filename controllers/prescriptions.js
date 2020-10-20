const Prescription = require("../models/prescriptions");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../services/transaction");
const { json } = require("body-parser");

exports.create = async (req, res, next) => {
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
};

exports.get = async (req, res, next) => {
    try {
        const prescription = await Prescription.findOne({ _id: req.params.id, isDeleted: false }).populate("patientId", "name").populate("doctorId","name");

        if (isEmpty(prescription)) {
            return res.status(404).json({
                success: false,
                error: "Not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAll = async (req, res, next) => {
    const page = Number(req.query.page); // page index
    const limit = Number(req.query.limit); // limit docs per page
    try {
        let Prescriptions;
        let query = {
            ...pick(req.body, "patientId", "doctorId", "conclude"),
            isDeleted: false
        };

        if (!page || !limit) {
            Prescriptions = await Prescription.find(query)
                .select(
                    "patientId doctorId conclude"
                )
                .populate("patientId", "name").populate("doctorId","name");
        } else {
            Prescriptions = await Prescription.find(query)
                .select(
                    "patientId doctorId conclude"
                )
                .populate("patientId", "name").populate("doctorId","name")
                .skip(limit * (page - 1))
                .limit(limit);
        }

        return res.status(200).json({ success: true, data: Prescriptions });
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

        const updatePrescription = await Prescription.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            {
                ...pick(
                    req.body,
                    "patientId",
                    "doctorId",
                    "conclude"
                )
            },
            { session, new: true }
        );

        if (isEmpty(updatePrescription)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Updated failed"
            });
        }

        // Check exist
      

        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: updatePrescription
        });
    } catch (error) {
        await abortTransactions(sessions);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const deletedPrescription = await Prescription.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (isEmpty(deletedPrescription)) {
            return res.status(406).json({
                success: false,
                error: "Deleted failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedPrescription
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};