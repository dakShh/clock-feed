import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Message extends Document {
  content: string;
  createAt: Date;
  senderId: string;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  message: Message[];
}

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    verifyCode: {
      type: String,
      required: [true, 'Verify code is required']
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, 'Verify code expiry is required']
    },
    isAcceptingMessage: {
      type: Boolean,
      default: true
    },
    message: [MessageSchema]
  },
  { timestamps: true }
);

const UserModel: Model<User> = mongoose.models?.User || mongoose.model('User', UserSchema);

export default UserModel;
