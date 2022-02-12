const { Schema, model } = require("mongoose");

const EmpSchema = new Schema(
  {
    emp_name: {
      type: String,
      required: true,
    },
    emp_id: {
      type: String,
      required: true,
    },
    emp_salary: {
      type: Number,
      required: true,
    },
    emp_education: {
      type: String,
      required: true,
    },
    emp_experience: {
      type: Number,
      required: true,
    },
    emp_gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
    },
    emp_location: {
      type: String,
      required: true,
    },
    emp_phone: {
      type: Number,
      required: true,
    },
    emp_email: {
      type: String,
      required: true,
    },
    emp_designation: {
      type: String,
      required: true,
    },
    emp_photo: {
      type: [""],
      required: true,
      default: [
        "https://cdn-icons.flaticon.com/png/512/1144/premium/1144709.png?token=exp=1643956906~hmac=73efdb48532ec4a91d1dadf1c2682d1b",
      ],
    },
    emp_skills: {
      type: [""],
      required: true,
    },
  },
  { timestamps: true }
);

let empModel = model("emp", EmpSchema);

module.exports = empModel;
