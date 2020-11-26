const Prescriptionbilldetails = require("../../models/prescriptionbilldetails");
const { isEmpty, pick, isArray } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");
const Medicine = require("../../models/medicines");
const create = async (req, res) => {
    let sessions = [];
    try {
        // const prescriptionbillId = req.body.prescriptionbillId;
        // const medicineId = req.body.medicineId;
        // const quantity = req.body.quantity;

        // // Check not enough property
        // if (isEmpty(prescriptionbillId) || isEmpty(medicineId) || !quantity) {
        //     return res.status(406).json({
        //         success: false,
        //         error: "Not enough property"
        //     });
        // }

        // If not array, return
        if (isArray(req.body) !== true) {
            return res.status(406).json({
                success: false,
                error: "You must be pass an array"
            });
        }

        // Transactions
        let session = await startSession();
        session.startTransaction();
        sessions.push(session);
        
        // Prepare data
        let array = req.body.map(element => 
            pick(element,
                "prescriptionbillId",
                "medicineId",
                "quantity"
            )
        )
        
        //Create
        const newPrescriptionbilldetails = await Prescriptionbilldetails.insertMany(
            array,
            { session: session }
        )

        if (isEmpty(newPrescriptionbilldetails)) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }

        arrayMethod = []
        array.forEach(element => {
            arrayMethod.push(() => {
                Medicine.findOneAndUpdate(
                    { _id: element.medicineId, isDeleted: false },
                    {
                        $inc : {'quantity' : -(element.quantity)}
                    },
                    { session, new: true }
                )
            })
        })

        await Promise.all(arrayMethod)

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