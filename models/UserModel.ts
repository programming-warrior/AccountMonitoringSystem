import mongoose, { Document, Schema } from 'mongoose';

 export interface UserDocument extends Document {
  email: string;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  email: String,
  password: String,
});

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;
