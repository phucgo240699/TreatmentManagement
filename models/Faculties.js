const mongoose = require("mongoose")

const Schema = mongoose.Schema

const Faculties = new Schema({
  name: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  }
}, { timestamps: true })

module.exports = mongoose.model("faculties", Faculties)