import mongoose, { Document, SchemaTypes } from "mongoose";
import { AuthModel } from "./auth";

export interface IUserDocument extends Pick<Document, '_id'> {
  name: string;
  email: string;
  password: string;
  status: string;
  provider: string;
  networkId?: string | number;
}


export const UserSchema = new mongoose.Schema(
  {
    networkId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);


export const UserCreateOrUpdate = async (body: IUserDocument) => {
  let user = await UserModel.findOne({ email: body.email, provider: body.provider }) as IUserDocument;

  if (user) {
    await UserModel.findOneAndUpdate({ _id: user._id }, body);
  } else {
    const userData = new UserModel(body)
    user = await userData.save();
  }
  return user;
};