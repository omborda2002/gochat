import ConnectedUsers from "@/models/ConnectedUsers";
import Messages from "@/models/Messages";
import dbConnect from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res
        .status(422)
        .json({ message: "req_method_not_supported", ok: false });
    }
    let { currentUser_id, message, roomId } = req.body;

    if (!currentUser_id || !message || !roomId) {
      return res.status(422).json({ message: "data_incomplete", ok: false });
    }

    const checkRoom = await ConnectedUsers.find({
      currentUser_id: currentUser_id,
      roomId: roomId,
    });

    if (!checkRoom) {
      return res
        .status(404)
        .json({ message: "User Not Founed in this room", ok: false });
    }

    const data = await Messages.create({
      message: message,
      sender: currentUser_id,
      roomId: roomId,
    });
    const result = await data.save();

    return res.status(201).json({
      message: "Message sent!",
      ok: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error, ok: false });
  }
};

export default dbConnect(handler);
