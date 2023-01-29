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
    let { roomId } = req.body;

    if (!roomId) {
      return res.status(422).json({ message: "data_incomplete", ok: false });
    }

    const u = await ConnectedUsers.find({
      roomId,
    });

    return res
      .status(201)
      .json({ message: "Connected User List!", list: u, ok: true });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default dbConnect(handler);
