import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", "accesstoken=; HttpOnly; Max-Age=0");
  res.end();
}

export default handler;
