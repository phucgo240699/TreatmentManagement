const Prescriptionbill = require("../models/prescriptionbills");
const Prescriptiondetail = require("../models/prescriptiondetails");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../services/transaction");
const { json } = require("body-parser");

exports.create = async (req, res, next) => {
    let sessions = [];
    try {
        const prescriptionId = req.body.prescriptionId;
        const pharmacistId = req.body.pharmacistId;
        const into_money = req.body.into_money;
        // Check not enough property
        if (isEmpty(prescriptionId) || isEmpty(pharmacistId)) {
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
        const newPrescriptionbill = await Prescriptionbill.create(
            [
                {
                    ...pick(
                        req.body,
                        "prescriptionId",
                        "pharmacistId",
                        "into_money"
                    )
                }
            ],
            { session: session }
        );

        if (isEmpty(newPrescriptionbill)) {
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
            data: newPrescriptionbill[0]
        });
    } catch (error) {
        await abortTransactions(sessions);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.review = async (req, res, next) => {
    try {
        const prescriptionId = req.body.prescriptionId;
        const pharmacistId = req.body.pharmacistId;
        // Check not enough property
        if (isEmpty(prescriptionId) || isEmpty(pharmacistId)) {
            return res.status(406).json({
                success: false,
                error: "Not enough property"
            });
        }

        var into_money = 0;
        var list = await Prescriptiondetail.find({ isDeleted: false, prescriptionId: prescriptionId })
            .select(
                "medicineId quantity"
            )
            .populate({ path: "medicineId", select: ["price", "name", "quantity","unit"] });

        var list_err=[];

        list.forEach((value) => {
            if(value.medicineId.quantity < value.quantity)
            {
                var temp_err = "Thuốc " + value.medicineId.name + " chỉ còn " + value.medicineId.quantity + " " + value.medicineId.unit;
                list_err.push(temp_err);
            }
            into_money += value.medicineId.price * value.quantity;
        })

        if(list_err.length > 0){
            return res.status(406).json({
                success: false,
                err: list_err
            });
        }

        //Create review
        const newPrescriptionbill =
        {
            ...pick(
                req.body,
                "prescriptionId",
                "pharmacistId"
            ),
            into_money: into_money
        }
        // Done
        return res.status(200).json({
            success: true,
            data: newPrescriptionbill
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.get = async (req, res, next) => {
    try {
        const prescriptionbill = await Prescriptionbill.findOne({ _id: req.params.id, isDeleted: false }).populate("pharmacistId", "name");

        if (isEmpty(prescriptionbill)) {
            return res.status(404).json({
                success: false,
                error: "Not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: prescriptionbill
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAll = async (req, res, next) => {
    const page = Number(req.query.page); // page index
    const limit = Number(req.query.limit); // limit docs per page
    try {
        let Prescriptionbills;
        let query = {
            ...pick(req.body, "prescriptionId", "pharmacistId", "into_money"),
            isDeleted: false
        };

        if (!page || !limit) {
            Prescriptionbills = await Prescriptionbill.find(query)
                .select(
                    "prescriptionId pharmacistId into_money"
                )
                .populate("pharmacistId", "name");
        } else {
            Prescriptionbills = await Prescriptionbill.find(query)
                .select(
                    "prescriptionId pharmacistId into_money"
                )
                .populate("patientId", "name")
                .skip(limit * (page - 1))
                .limit(limit);
        }

        return res.status(200).json({ success: true, data: Prescriptionbills });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// exports.update = async (req, res, next) => {
//     let sessions = [];
//     try {
//         // Transactions
//         let session = await startSession();
//         session.startTransaction();
//         sessions.push(session);

//         const updatePrescriptionbill = await Prescriptionbill.findOneAndUpdate(
//             { _id: req.params.id, isDeleted: false },
//             {
//                 ...pick(
//                     req.body,
//                     "patientId",
//                     "doctorId",
//                     "conclude"
//                 )
//             },
//             { session, new: true }
//         );

//         if (isEmpty(updatePrescriptionbill)) {
//             await abortTransactions(sessions);
//             return res.status(406).json({
//                 success: false,
//                 error: "Updated failed"
//             });
//         }

//         // Check exist


//         // Done
//         await commitTransactions(sessions);

//         return res.status(200).json({
//             success: true,
//             data: updatePrescriptionbill
//         });
//     } catch (error) {
//         await abortTransactions(sessions);
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };

// exports.delete = async (req, res, next) => {
//     try {
//         const deletedPrescriptionbill = await Prescriptionbill.findOneAndUpdate(
//             { _id: req.params.id, isDeleted: false },
//             { isDeleted: true },
//             { new: true }
//         );

//         if (isEmpty(deletedPrescriptionbill)) {
//             return res.status(406).json({
//                 success: false,
//                 error: "Deleted failed"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: deletedPrescriptionbill
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };