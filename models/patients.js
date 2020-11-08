const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Patients = new Schema(
    {
        name: {
            type: String,
            index: true,
            required: true
        },
        birthday: {
            type: Date,
            index: true,
            required: true
        },
        address: {
            type: String,
            index: true,
            required: true
        },
        phoneNumber: {
            type: String,
            index: true,
            required: true
        },
        email: {
          type: String,
          index: true,
          required: true
        },
        gender: {
          type: String,
          index: true,
          required: true,
          enum: ["male", "female"],
          default: "male"
        },
        job: {
            type: String,
            default: '',
            index: true
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

module.exports = mongoose.model("patients", Patients);