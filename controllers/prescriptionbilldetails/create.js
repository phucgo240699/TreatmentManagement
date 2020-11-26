const Prescriptionbilldetails = require("../../models/prescriptionbilldetails");
const { isEmpty, pick, isArray } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../../services/transaction");
const Medicine = require("../../models/medicines");
const create = async (req, res) => {
    let sessions = [];
    try {
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
        
        // Prepare data for Create
        let data = req.body.map(element => 
            pick(element,
                "prescriptionbillId",
                "medicineId",
                "quantity"
            )
        )
        
        // Create
        const newPrescriptionbilldetails = await Prescriptionbilldetails.insertMany(
            data,
            { session: session }
        )

        if (isEmpty(newPrescriptionbilldetails) || newPrescriptionbilldetails.length != data.length) {
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }

<<<<<<< Updated upstream
        // Check exist
        let findPrescriptionBilldetailMethods = []
        data.forEach(element => {
            findPrescriptionBilldetailMethods.push(
                Prescriptionbilldetails.find({
                    prescriptionbillId: element.prescriptionbillId,
                    medicineId: element.medicineId,
                    isDeleted: false
                }, null, { session })
            )
        })
        let oldPrescriptionBilldetails = await Promise.all(findPrescriptionBilldetailMethods)

        if (oldPrescriptionBilldetails.length > 0) {
            await abortTransactions(sessions);
            return res.status(409).json({
                success: false,
                error: "This Prescriptionbilldetails is already exist"
            });
        }

        // Prepare data for update quantity
        let updateQuantityMethods = []
        data.forEach(element => {
            updateQuantityMethods.push(
=======
        arrayMethod = []
        array.forEach(element => {
            arrayMethod.push(
>>>>>>> Stashed changes
                Medicine.findOneAndUpdate(
                    { _id: element.medicineId, isDeleted: false },
                    {
                        $inc : {'quantity' : -(element.quantity)}
                    },
                    { session, new: true }
                )
            )
        })

<<<<<<< Updated upstream
        // Update quantity
        let updatedQuantity = await Promise.all(updateQuantityMethods)

        // Check quantity
        if (isEmpty(updatedQuantity) || updatedQuantity.length != data.length) {
=======
        let updateMedicine = await Promise.all(arrayMethod)

        if (updateMedicine.length !== array.length) {
>>>>>>> Stashed changes
            await abortTransactions(sessions);
            return res.status(406).json({
                success: false,
                error: "out of stock"
            });
        }
<<<<<<< Updated upstream

=======
        
        // Check exist
        // const oldPrescriptionbilldetails = await Prescriptionbilldetails.find({
        //     prescriptionbillId: prescriptionbillId,
        //     medicineId: medicineId,
        //     isDeleted: false
        // }, null, { session });
        
        // if (oldPrescriptionbilldetails.length > 1) {
        //     await abortTransactions(sessions);
        //     return res.status(409).json({
        //         success: false,
        //         error: "This Prescriptionbilldetails is already exist"
        //     });
        // }
        
>>>>>>> Stashed changes
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