const Prescriptionbilldetails = require("../../models/prescriptionbilldetails");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");
const Medicine = require("../../models/medicines");
const create = async (req, res) => {
    let sessions = [];
    try {
        const prescriptionbillId = req.body.prescriptionbillId;
        const medicineId = req.body.medicineId;
        const quantity = req.body.quantity;

        // Check not enough property
        if (isEmpty(prescriptionbillId) || isEmpty(medicineId) || !quantity) {
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
        const newPrescriptionbilldetails = await Prescriptionbilldetails.create(
            [
                {
                    ...pick(
                        req.body,
                        "prescriptionbillId",
                        "medicineId",
                        "quantity"
                    )
                }
            ],
            { session: session }
        );

        if (isEmpty(newPrescriptionbilldetails)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }

        const updateMedicine = await Medicine.findOneAndUpdate(
            { _id: medicineId, isDeleted: false },
            {
                $inc : {'quantity' : -quantity}
            },
            { session, new: true }
        );

        if (isEmpty(updateMedicine) || updateMedicine.quantity < 0) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "out of stock"
            });
        }

      

        // Check exist
        const oldPrescriptionbilldetails = await Prescriptionbilldetails.find({
            prescriptionbillId: prescriptionbillId,
            medicineId: medicineId,
            isDeleted: false
        }, null, { session });


        if (oldPrescriptionbilldetails.length > 1) {
            await abortTransactions(sessions);
            return res.status(409).json({
                success: false,
                error: "This Prescriptionbilldetails is already exist"
            });
        }


        // Done
        await commitTransactions(sessions);

        return res.status(200).json({
            success: true,
            data: newPrescriptionbilldetails[0]
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