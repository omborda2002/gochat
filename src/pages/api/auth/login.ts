import dbConnect from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Users from "@/models/Users";
import { verifyPassword } from "@/utils/authHelpers";
import jwt from "jsonwebtoken";
import Cookie from "cookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res
        .status(422)
        .json({ message: "req_method_not_supported", ok: false });
    }
    let { username, password } = req.body;
    if (!username || !password) {
      return res.status(422).json({ message: "data_incomplete", ok: false });
    }
    username = username.toLowerCase();

    const user = await Users.findOne({ username }).select(
      "-createdAt -updatedAt -timestamp"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Username or password incorrect" });
    }
    user.password = undefined;
    const token = jwt.sign({ ...user }, `${process.env.JWT_TOKEN_SECRET}`);
    res.setHeader(
      "Set-Cookie",
      Cookie.serialize("accesstoken", token, {
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 604800,
        path: "/",
      })
    );
    return res.status(201).json({ message: "Login successful!", token });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default dbConnect(handler);
