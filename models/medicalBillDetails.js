const mongoose = require("mongoose")

const Schema = mongoose.Schema

const MedicalBillDetails = new Schema({
  medicalBillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medicalbills',
    required: true,
    index: true
  },
  note: {
    type: String,
    required: true,
    index: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'services',
    required: true,
    index: true
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  }
}, { timestamps: true })

module.exports = mongoose.model("medicalbilldetails", MedicalBillDetails)