import mongoose, { Document, Model, Mongoose } from "mongoose";

export interface IAuthDocument extends Pick<Document, '_id'> {
  provider: string;
  accessToken: string;
  userId?: string;
  expiresIn: string;
  signedRequest?: string;
  graphDomain?: string;
  dataAccessExpirationTime?: string;
  refreshToken?: string;
}


export const AuthSchema = new mongoose.Schema(
  {
    provider:  {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: false,
      default: null,
    },
    accessToken: {
      type: String,
      required: true,
      default: null,
    },
    refreshToken: {
      type: String,
      required: false,
      default: null,
    },
    expiresIn: {
      type: String,
      required: true,
    },
    signedRequest: {
      type: String,
      required: false,
      default: null
    },
    graphDomain: {
      type: String,
      required: false,
      default: null
    },
    dataAccessExpirationTime: {
      type: Number,
      required: false,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

export const AuthModel = mongoose.model<IAuthDocument>("Auth", AuthSchema);