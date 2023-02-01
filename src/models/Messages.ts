import moment from "moment";
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
    date: {
      type: Date,
      default: Date.now,
      required: [true, "Please provide a date"],
    },
  },
  { timestamps: true }
);

const Messages =
  mongoose.models.Messages || mongoose.model("Messages", MessagesSchema);

export default Messages;

const timeLimit = 1440;

(async () => {
  async function deleteRecords() {
    const cutOffTime = moment().subtract(timeLimit, "minutes").toDate();

    await Messages.deleteMany({ createdAt: { $lt: cutOffTime } });

    console.log(`Deleted all documents created before ${cutOffTime}`);
  }

  // Call the deleteRecords function every 30 minutes
  setInterval(deleteRecords, 1440 * 60 * 1000);
})();
