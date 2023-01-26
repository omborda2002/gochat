import withAuth from "@/app/withAuth";
import Button from "@/components/style/Button";
import React, { useEffect, useLayoutEffect, useState } from "react";
import ReactCodeInput from "react-code-input";
import Plan from "@/images/plan.svg";
import Logout from "@/images/logout.svg";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/images/logo.png";
import clsx from "clsx";
import { IBM_Plex_Mono } from "@next/font/google";
import Cookies from "cookie";
import jwt_decode from "jwt-decode";
import Tooltip from "@/components/style/Tooltip";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
});

const Room = ({ token }: any) => {
  const router = useRouter();
  const logout = async () => {
    localStorage.removeItem("accesstoken");
    deleteCookie("accesstoken");
    console.log("CLEAR COOKIES SUCCESSFULLY");
    router.push("/auth/login");
  };
  useLayoutEffect(() => {
    if (!localStorage.getItem("accesstoken")) {
      router.push("/auth/login");
    }
  }, []);

  const deleteCookie = (name: any) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };
  // function deleteCookie(name: string) {
  //   // set the expiration date to a past date
  //   var date = new Date();
  //   date.setTime(date.getTime() - 1);
  //   var expires = "; expires=" + date.toUTCString();
  //   // set the cookie value to an empty string and the expiration date to a past date
  //   document.cookie = name + "=" + expires + "; path=/";
  // }
  return (
    <div
      className={
        "min-w-[100vw] md:px-[100px] h-full md:py-[80px] px-[40px] py-[100px] "
      }
    >
      <div className="w-full flex flex-row justify-between items-center">
        <div>
          <Link href={"/"}>
            <div className="flex space-x-0 items-center select-none justify-center md:justify-start">
              <div className="relative w-[50px] h-[50px]">
                <Image src={Logo} alt="logo" fill priority />
              </div>
              <h1
                className={clsx(
                  "relative text-3xl tracking-tighter select-none text-white",
                  ibm.className
                )}
              >
                GoChat
                <span className="absolute w-[100px] h-[100px] top-[-55px] left-0">
                  <Image src={Plan} fill alt="Plan" priority />
                </span>
              </h1>
            </div>
          </Link>
        </div>
        {token?.username ? (
          <div className="w-auto h-auto flex flex-row space-x-2 items-center ease-in-out duration-300">
            <Tooltip tooltip="Username">
              <div className="decoration-pink-500 select-none  underline underline-offset-2 hover:hover:underline-offset-4 hover:bg-white/10">
                {token.username}
              </div>
            </Tooltip>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <div className="p-4 cursor-pointer z-0" onClick={logout}>
                <Image
                  src={Logout}
                  width={35}
                  height={35}
                  alt="Logout"
                  priority
                  className="backdrop-blur-md hover:bg-white/10 p-[5px] border border-neutral-600 rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        ) : (
          ""
        )}
      </div>
      <Content />
    </div>
  );
};

export default withAuth(Room);

const Content = () => {
  const [password, setPassword] = useState("");
  const [btnIsPressed, setBtnIsPressed] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [width, setWidth] = useState<any>(0);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  const checkPassword = () => {
    const isPasswordValid = password.length === 6;
    setBtnIsPressed(true);
    setIsPasswordValid(isPasswordValid);
    if (!isPasswordValid) setPassword("");
  };

  const handlePinChange = (Password: any) => {
    setPassword(Password);
    setBtnIsPressed(false);
  };

  const propsStyle = {
    inputStyle: {
      margin: parseInt(width) < 768 ? "2px" : "8px",
      marginLeft: "0px",
      MozAppearance: "textfield",
      width: parseInt(width) < 768 ? "40px" : "50px",
      borderRadius: "5px",
      fontSize: "14px",
      height: "50px",
      paddingLeft: parseInt(width) < 768 ? "15px" : "20px",
      backgroundColor: "rgb(31 41 55 / 0.75)",
      color: "white",
      border: "1px solid rgb(31 41 55 / 0.75)",
    },
    inputStyleInvalid: {
      margin: parseInt(width) < 768 ? "2px" : "8px",
      marginLeft: "0px",
      MozAppearance: "textfield",
      width: parseInt(width) < 768 ? "40px" : "50px",
      borderRadius: "5px",
      fontSize: "14px",
      height: "50px",
      paddingLeft: parseInt(width) < 768 ? "15px" : "20px",
      backgroundColor: "black",
      color: "red",
      border: "1px solid red",
    },
  };

  const workingSubmit = (e: any) => {
    e.preventDefault();
    checkPassword();
    if (password.length === 6 && isPasswordValid) {
      console.log("password is valid");
    }
  };
  return (
    <div className="flex flex-col md:ml-2 h-full md:w-full">
      <p className="text-lg text-gray-500 text-center md:text-left mt-4 md:mt-0">
        Enter the room code
      </p>
      <form className="w-full select-none h-full md:w-full flex flex-col items-center mt-[100px] space-y-4">
        <span className="uppercase px-[15px] text-md bg-gray-800/75 rounded-full mb-[30px] border border-neutral-600 text-white">
          CREATE ROOM CODE
        </span>
        <div className="group relative w-72 md:w-80 lg:w-96 !mb-5">
          <label className="block pb-1 text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-rose-400 capitalize">
            Secret Code
          </label>
          <ReactCodeInput
            id="password"
            type="password"
            autoFocus={false}
            isValid={isPasswordValid}
            fields={6}
            onChange={handlePinChange}
            value={password}
            className="!w-full !flex !justify-between !items-center"
            {...propsStyle}
          />
        </div>
        <Button text="Login" width onClick={workingSubmit} />
      </form>
    </div>
  );
};

Room.getInitialProps = async (ctx: any) => {
  const { req, res } = ctx;
  if (req && res) {
    const cookies = Cookies.parse(req.headers.cookie || "");
    if (cookies.accesstoken) {
      let decoded = jwt_decode(cookies.accesstoken);
      return {
        token: decoded?._doc,
      };
    } else {
      res.writeHead(302, {
        Location: "/auth/login",
      });
      res.end();
    }
  }
  return {};
};
