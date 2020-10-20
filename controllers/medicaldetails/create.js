const MedicalDetails = require("../../models/medicaldetails");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");
const {storeImage} = require("../../services/storeimage");
const create = async (req, res) => {
    let sessions = [];
    try {
        const medicalrecordId = req.body.medicalrecordId;
        const doctorId = req.body.doctorId;
        const result = req.body.result;
        // Check not enough property
        if (isEmpty(medicalrecordId) || isEmpty(doctorId) || isEmpty(result)) {
            return res.status(406).json({
                success: false,
                error: "Not enough property"
            });
        }

        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);

        // create list more images
        var images = []
        if (!isEmpty(req.body.images)) {
            var listimages = req.body.images.split(',d');
            if (listimages instanceof Array) {
                for (var i = 0; i < listimages.length; i++) {
                    if (i != 0) {
                        listimages[i] = "d" + listimages[i];
                    }
                    images.push(storeImage(listimages[i]));
                }
            }
            else {
                images.push(storeImage(listimages));
            }
        }

        //Create
        const newMedicalDetails = await MedicalDetails.create(
            [
                {
                    ...pick(
                        req.body,
                        "medicalrecordId",
                        "doctorId",
                        "result",
                        "prescriptionId"
                    ),
                    images: images
                }
            ],
            { session: session }
        );

        if (isEmpty(newMedicalDetails)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }
        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: newMedicalDetails[0]
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