const { isEmpty } = require("lodash");
const MedicalDetails = require("../../models/medicaldetails");

const _delete = async(req,res)=>{
    try {
        const deletedMedicalDetails = await MedicalDetails.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (isEmpty(deletedMedicalDetails)) {
            return res.status(406).json({
                success: false,
                error: "Deleted failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedMedicalDetails
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {_delete}