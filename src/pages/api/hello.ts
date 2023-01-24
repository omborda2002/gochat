import dbConnect from "@/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import Users from "@/models/Users";
import bcrypt from "bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Check if name, email or password is provided
    const { name, email, password } = req.body;
    if (name && email && password) {
      try {
        // Hash password to store it in DB
        var passwordhash = await bcrypt.sign(password);
        var user = new Users({
          name,
          email,
          password: passwordhash,
        });
        // Create new user
        var usercreated = await user.save();
        return res.status(200).send(usercreated);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    } else {
      res.status(422).send("data_incomplete");
    }
  } else {
    res.status(422).send("req_method_not_supported");
  }
}

export default dbConnect(handler);
