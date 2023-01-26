import dbConnect from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Users from "@/models/Users";
import { hashPassword } from "@/utils/authHelpers";
import jwt from "jsonwebtoken";
import Cookie from "cookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res
        .status(422)
        .json({ message: "req_method_not_supported", ok: false });
    }
    let { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(422).json({ message: "data_incomplete", ok: false });
    }
    username = username.toLowerCase();

    //Check if user exists
    const existingUser = await Users.findOne({ username });

    if (existingUser) {
      return res.status(422).json({ message: "User already exists!" });
    } else {
      const hashedPassword: string = await hashPassword(password);

      const user = new Users({
        name,
        username,
        password: hashedPassword,
      });

      const result = await user.save();

      const data = {
        username: result.username,
        id: result._id,
        name,
      };

      const token = jwt.sign({ ...data }, `${process.env.JWT_TOKEN_SECRET}`);
      res.setHeader(
        "Set-Cookie",
        Cookie.serialize("accesstoken", token, {
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 604800,
          path: "/",
        })
      );
      return res.status(201).json({ message: "Created User!", token });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default dbConnect(handler);
