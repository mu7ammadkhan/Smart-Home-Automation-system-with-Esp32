import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IRoom extends Document {
  name: string
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const RoomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Room = models.Room || model<IRoom>("Room", RoomSchema)

export default Room