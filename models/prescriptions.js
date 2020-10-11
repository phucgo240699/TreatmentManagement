const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Prescriptions = new Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"patients",
            index: true,
            required: true
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"users",
            index: true,
            required: true
        },
        conclude: {
            type: String,
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

module.exports = mongoose.model("prescriptions", Prescriptions);