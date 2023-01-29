import mongoose from "mongoose";

/* UsersSchema will correspond to a collection in your MongoDB database. */
const ConnectedUsersSchema = new mongoose.Schema(
  {
    currentUser_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a id"],
    },
    name: {
      type: String,
      required: [true, "Please provide a Email."],
    },
    username: {
      type: String,
      required: [true, "Please provide a password."],
    },
    roomId: {
      type: String,
      required: [true, "Please provide a id"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.ConnectedUsers ||
  mongoose.model("ConnectedUsers", ConnectedUsersSchema);
