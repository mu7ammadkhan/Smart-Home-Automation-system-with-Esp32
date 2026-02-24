import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name : string;
    email : string;
    password : string;
    role: "user" | "admin";
    createdaAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: [ "user", 'admin'],
            default: "user"
        },
    },
    {
        timestamps: true,
    }
);

const User: Model<IUser> = 
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;