import ConnectedUsers from "@/models/ConnectedUsers";
import dbConnect from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res
        .status(422)
        .json({ message: "req_method_not_supported", ok: false });
    }
    let { user } = req.body;

    if (!user) {
      return res.status(422).json({ message: "data_incomplete", ok: false });
    }

    const result = await ConnectedUsers.findOne({
      currentUser_id: user,
    });
    if (!result) {
      return res.status(404).json({ message: "User Not Founed", ok: false });
    }
    return res.status(201).json({
      message: "User already joined room!",
      room: result.roomId,
      ok: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default dbConnect(handler);
