// const { pick } = require("lodash");
// const { startSession } = require("mongoose");
// const { abortTransactions, commitTransactions } = require("../../services/transaction");
// const Prescriptionbill = require("../../models/prescriptiondetails");

// const update = async (req, res) => {
//     let sessions = [];
//         try {
//             // Transactions
//             let session = await startSession();
//             session.startTransaction();
//             sessions.push(session);
    
//             const updatePrescriptionbill = await Prescriptionbill.findOneAndUpdate(
//                 { _id: req.params.id, isDeleted: false },
//                 {
//                     ...pick(
//                         req.body,
//                         "patientId",
//                         "doctorId",
//                         "conclude"
//                     )
//                 },
//                 { session, new: true }
//             );
    
//             if (isEmpty(updatePrescriptionbill)) {
//                 await abortTransactions(sessions);
//                 return res.status(406).json({
//                     success: false,
//                     error: "Updated failed"
//                 });
//             }
    
//             // Check exist
    
    
//             // Done
//             await commitTransactions(sessions);
    
//             return res.status(200).json({
//                 success: true,
//                 data: updatePrescriptionbill
//             });
//         } catch (error) {
//             await abortTransactions(sessions);
//             return res.status(500).json({ success: false, error: error.message });
//         }
// }

// module.exports = { update }