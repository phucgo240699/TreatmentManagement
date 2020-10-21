const mongoose = require("mongoose")

const Schema = mongoose.Schema

const Departments = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  facultyId: {
    type: Schema.Types.ObjectId,
    ref: "faculties",
    required: true,
    index: true
  },
  queue: [{
    type: Schema.Types.ObjectId,
    ref: "patients"
  }],
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  }
}, { timestamps: true })

module.exports = mongoose.model("departments", Departments)