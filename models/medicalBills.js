const mongoose = require("mongoose")

const Schema = mongoose.Schema

const MedicalBills = new Schema({
  totalPrice: {
    type: Number,
    required: true
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  }
}, { timestamps: true })

module.exports = mongoose.model("medicalBills", MedicalBills)