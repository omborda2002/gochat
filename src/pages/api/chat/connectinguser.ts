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
    let { currentUser_id, name, username, roomId } = req.body;

    if (!username || !roomId || !currentUser_id || !name) {
      return res.status(422).json({ message: "data_incomplete", ok: false });
    }

    const u = new ConnectedUsers({
      currentUser_id: currentUser_id,
      name: name,
      username: username,
      roomId: roomId,
    });

    const result = await u.save();

    return res
      .status(201)
      .json({ message: "Connected User Added!", result, ok: true });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default dbConnect(handler);
