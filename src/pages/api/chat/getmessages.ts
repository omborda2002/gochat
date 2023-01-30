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
    let { roomId } = req.body;

    if (!roomId) {
      return res.status(422).json({ message: "data_incomplete", ok: false });
    }

    const messages = await Messages.aggregate([
      {
        $lookup: {
          from: "connectedusers",
          localField: "sender",
          foreignField: "currentUser_id",
          as: "user",
        },
      },
      { $match: { roomId: roomId } },
    ]).sort({ updatedAt: 1 });

    return res.status(201).json({
      message: "Message sent!",
      ok: true,
      messages: messages,
    });
  } catch (error) {
    return res.status(500).json({ message: error, ok: false });
  }
};

export default dbConnect(handler);
