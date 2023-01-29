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
    let { userId: currentUser_id, roomId } = req.body;

    if (!roomId || !currentUser_id) {
      return res.status(422).json({ message: "data_incomplete", ok: false });
    }

    const result = await ConnectedUsers.deleteOne({
      currentUser_id: currentUser_id,
      roomId: roomId,
    });
    if (!result)
      return res.status(404).json({ message: "User Not Founed", ok: false });

    return res
      .status(201)
      .json({ message: "Dis-Connected User Added!", result, ok: true });
  } catch (error) {
    return res.status(500).json({ message: error, ok: false });
  }
};

export default dbConnect(handler);
