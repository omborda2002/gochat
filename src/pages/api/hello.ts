import Messages from "@/models/Messages";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const timeLimit = 1440;

  async function deleteRecords() {
    const cutOffTime = moment().subtract(timeLimit, "minutes").toDate();

    await Messages.deleteMany({ createdAt: { $lt: cutOffTime } });

    console.log(`Deleted all documents created before ${cutOffTime}`);
  }

  // Call the deleteRecords function every 30 minutes
  setInterval(deleteRecords, 1440 * 60 * 1000);
  res.end();
}

export default handler;
