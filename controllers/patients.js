const Patient = require("../models/patients");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../services/transaction");
const { json } = require("body-parser");

exports.create = async (req, res, next) => {
    let sessions = [];
    try {
        const name = req.body.name;
        const birthday = req.body.birthday;
        const address = req.body.address;
        const phoneNumber = req.body.phoneNumber;
        // Check not enough property
        if (isEmpty(name) || isEmpty(birthday) || isEmpty(address) || isEmpty(phoneNumber)) {
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
        const newPatient = await Patient.create(
            [
                {
                    ...pick(
                        req.body,
                        "name",
                        "birthday",
                        "address",
                        "phoneNumber",
                        "job"
                    )
                }
            ],
            { session: session }
        );

        if (isEmpty(newPatient)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }

        // Check exist
        const oldPatient = await Patient.find({
            name: name,
            isDeleted: false
        });


        if (oldPatient.length > 0) {
            await abortTransactions(sessions);
            return res.status(409).json({
                success: false,
                error: "This Patient's record is already exist"
            });
        }


        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: newPatient[0]
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
        const patient = await Patient.findOne({ _id: req.params.id, isDeleted: false });

        if (isEmpty(patient)) {
            return res.status(404).json({
                success: false,
                error: "Not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAll = async (req, res, next) => {
    const page = Number(req.query.page); // page index
    const limit = Number(req.query.limit); // limit docs per page
    try {
        let patients;
        let query = {
            ...pick(req.body, "name", "birthday", "address", "phoneNumber", "job"),
            isDeleted: false
        };

        if (!page || !limit) {
            patients = await Patient.find(query)
                .select(
                    "name birthday address phoneNumber job "
                );
        } else {
            patients = await Patient.find(query)
                .select(
                    "name birthday address phoneNumber job"
                )
                .skip(limit * (page - 1))
                .limit(limit);
        }

        return res.status(200).json({ success: true, data: patients });
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

        const updatePatient = await Patient.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            {
                ...pick(
                    req.body,
                    "name",
                    "birthday",
                    "address",
                    "phoneNumber",
                    "job"
                )
            },
            { session, new: true }
        );

        if (isEmpty(updatePatient)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Updated failed"
            });
        }

        // Check exist
        if (req.body.name) {
            let isChangeName = true;
            const [patients, beforeUpdated] = await Promise.all([
                Patient.find({ name: req.body.name, isDeleted: false }),
                Patient.findOne({
                    _id: req.params.id,
                    isDeleted: false
                })
            ]);

            if (beforeUpdated.name === updatePatient.name) {
                isChangeName = false;
            }

            if (patients.length > 0 && isChangeName) {
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
            data: updatePatient
        });
    } catch (error) {
        await abortTransactions(sessions);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const deletedPatient = await Patient.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (isEmpty(deletedPatient)) {
            return res.status(406).json({
                success: false,
                error: "Deleted failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedPatient
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};