import mongoose from "mongoose";

const MessagesSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "Who sending this message?"],
    },
    message: {
      type: String,
      required: [true, "What is your message?"],
    },
    roomId: {
      type: String,
      required: [true, "Please provide a room id"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Messages ||
  mongoose.model("Messages", MessagesSchema);
