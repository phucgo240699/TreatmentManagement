const { isEmpty } = require("lodash");
const Medicines = require("../../models/medicines");

const _delete = async(req,res)=>{
    try {
        const deletedMedicine = await Medicines.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (isEmpty(deletedMedicine)) {
            return res.status(406).json({
                success: false,
                error: "Deleted failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedMedicine
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {_delete}