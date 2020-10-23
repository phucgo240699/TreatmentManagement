const Patient = require("../../models/patients");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");

const create = async (req, res) => {
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
        }, null, { session });


        if (oldPatient.length > 1) {
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
}

module.exports = { create }