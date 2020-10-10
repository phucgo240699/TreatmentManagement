const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Users = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    birthday: {
      type: Date,
      required: true
    },
    address: {
      type: String
    },
    phoneNumber: {
      type: String,
      required: true,
      index: true
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    username: {
      type: String,
      required: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "doctor", "pharmacist", "staff"],
      default: "staff"
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

module.exports = mongoose.model("users", Users);
