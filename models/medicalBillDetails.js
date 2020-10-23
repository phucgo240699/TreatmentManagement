const mongoose = require("mongoose")

const Schema = mongoose.Schema

const MedicalBillDetails = new Schema({
  medicalBillId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  prescriptionDetailId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  serviceIds: [{
    type: Schema.Types.ObjectId
  }],
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  }
}, { timestamps: true })

module.exports = mongoose.model("medicalBillDetails", MedicalBillDetails)