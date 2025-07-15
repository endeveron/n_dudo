import { User, UserRole } from '@/core/types/user';
import { Schema, model, models } from 'mongoose';

const userSchema = new Schema<User>(
  {
    id: { type: String },
    name: { type: String },
    email: { type: String, required: true },
    emailConfirmed: { type: Boolean, default: false },
    password: { type: String },
    role: { type: String, enum: UserRole, default: UserRole.user },
    image: { type: String },
  },
  {
    versionKey: false,
  }
);

const UserModel = models.User || model('User', userSchema);

export default UserModel;
