import mongoose from "mongoose";
import Joi from "joi"

const CounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const counter = mongoose.model("counter", CounterSchema);

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
  },
  admissionYear: {
    type: Number,
  },
  firstName: {
    type: String,
    required: [true, "firstname is required"],
    min: 3,
    max: 255
  },
  lastName: {
    type: String,
    required: [true, "lastname is required"],
    min: 3,
    max: 255
  },
  email: {
    type: String,
    required: [true,"email is required"],
    lowercase: true
  },
  password: {
    type: String,
    required: [true,"password is required"],
    select: false
  },
  gender: {
    type: String,
    required: [true,"gender is required"]
  },
  role: {
    type: String,
    required: [true,"role is required"]
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
}
);

studentSchema.pre("save", async function (next) {
  const currentYear = new Date().getFullYear();
  this.admissionYear = currentYear;

  try {
    const updatedCounter = await counter.findOneAndUpdate(
      { _id: "studentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();

    const currentCounter = updatedCounter.seq;
    this.studentId = `${currentYear + 4}${currentCounter}`;
    next();
  } catch (error) {
    next(error);
  }
});

const StudentModel = mongoose.model("Student", studentSchema);

const validate = (Student) =>{
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().lowercase().required()

  })
  return schema.validate(Student)
}
export {
  StudentModel,validate
} ;
