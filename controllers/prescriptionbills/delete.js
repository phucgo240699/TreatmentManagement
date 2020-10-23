// const { isEmpty } = require("lodash");
// const Prescriptionbill = require("../../models/prescriptionbills");

// const _delete = async (req, res) => {
//         try {
//             const deletedPrescriptionbill = await Prescriptionbill.findOneAndUpdate(
//                 { _id: req.params.id, isDeleted: false },
//                 { isDeleted: true },
//                 { new: true }
//             );

//             if (isEmpty(deletedPrescriptionbill)) {
//                 return res.status(406).json({
//                     success: false,
//                     error: "Deleted failed"
//                 });
//             }

//             return res.status(200).json({
//                 success: true,
//                 data: deletedPrescriptionbill
//             });
//         } catch (error) {
//             return res.status(500).json({ success: false, error: error.message });
//         }
// }

// module.exports = { _delete }