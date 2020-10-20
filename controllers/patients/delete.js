const { isEmpty } = require("lodash");
const Patient = require("../../models/patients");

const _delete = async (req, res) => {
    try {
        const deletedPatient = await Patient.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (isEmpty(deletedPatient)) {
            return res.status(406).json({
                success: false,
                error: "Deleted failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedPatient
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { _delete }