const mongoose = require("mongoose"); 
const bcrypt = require('bcryptjs');


var userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name Required"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, " Email Required"],
    unique: true,
    lowercase: true,
  },
  phone: String,
  profileImage: String,

  password: {
    type: String,
    required: [true, "Password Required"],
    minlength: [6, "Too short password"],
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  active: {
   type: Boolean,
   default: true,
  },
wishlist: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Sites',
},
],
},
{timestamps: true}
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


//Export the model
module.exports = mongoose.model("User", userSchema);
