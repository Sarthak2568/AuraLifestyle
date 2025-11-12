import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { nanoid } from 'nanoid';

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, index: true, default: () => 'USR_' + nanoid(10).toUpperCase() },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
      validate: { validator: (v) => validator.isEmail(v || ''), message: 'Invalid email' },
    },
    phone: { type: String, trim: true, default: null },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    password: { type: String, required: true, minlength: 6, select: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
