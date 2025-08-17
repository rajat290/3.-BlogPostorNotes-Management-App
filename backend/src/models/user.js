import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
     // ✅ Reset password fields
    resetPasswordToken:   String,
    resetPasswordExpires: Date,
    // role: {
    //     type: String,
    //     enum: ["user", "admin"],
    //     default: "user",
    // },
}, { timestamps: true });

// timestamps: true means that the createdAt and updatedAt fields will be automatically added to the schema


//hash password before saving

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next ();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Generate and set reset token (returns plain token)
userSchema.methods.getResetPasswordToken = function () {
  // plain token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // hash stored in DB
  const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordToken = hashed;
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
  return resetToken; // return plain for sending via email (or response in dev)
};

const User = mongoose.model("User", userSchema);
export default User;