import mongoose from "mongoose";

/* UsersSchema will correspond to a collection in your MongoDB database. */
const UsersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name."],
    },
    username: {
      type: String,
      required: [true, "Please provide a Email."],
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Users || mongoose.model("Users", UsersSchema);
