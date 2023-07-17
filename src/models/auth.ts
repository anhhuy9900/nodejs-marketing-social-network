import mongoose, { Document, Model, Mongoose } from "mongoose";

export interface IAuthDocument extends Pick<Document, '_id'> {
  accessToken: string;
  userId: string;
  expiresIn: string;
  signedRequest: string;
  graphDomain: string;
  dataAccessExpirationTime: string;
}


export const AuthSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      trim: true,
      default: null,
    },
    expiresIn: {
      type: String,
      required: true,
      default: null
    },
    signedRequest: {
      type: String,
      required: true,
      unique: true,
    },
    graphDomain: {
      type: String,
      required: true,
    },
    dataAccessExpirationTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AuthModel = mongoose.model<IAuthDocument>("Auth", AuthSchema);