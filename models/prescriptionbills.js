const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Prescriptionbills = new Schema(
    {
        prescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"prescriptions",
            index: true,
            required: true
        },
        into_money: {
            type: Number,
            index: true,
            required: true
        },
        pharmacistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"users",
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