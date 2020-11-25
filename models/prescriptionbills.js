const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Prescriptionbills = new Schema(
    {
        name: {
            type: String,
            index: true,
            required: true
        },
        prescriptionId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'prescriptions',
            indexes: true
        },
        conclude: {
            type: String,
            index: true,
            required: true
        },
        pharmacistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            index: true,
            required: true
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false,
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("prescriptionbills", Prescriptionbills);