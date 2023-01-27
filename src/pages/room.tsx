import withAuth from "@/app/withAuth";
import React, { useEffect } from "react";
import Plan from "@/images/plan.svg";
import Logout from "@/images/logout2.svg";
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
import Content from "@/components/Room/Content";
import { SocketContext, socket } from "@/context/socket";
import { RoomProvider } from "@/context/RoomContext";

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
  useEffect(() => {
    if (!localStorage.getItem("accesstoken")) {
      router.push("/auth/login");
    }
  }, []);

  const deleteCookie = (name: any) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };
  return (
    <SocketContext.Provider value={socket}>
      <RoomProvider>
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
              <div className="w-auto text-white h-auto flex flex-row space-x-2 items-center ease-in-out duration-300">
                <Tooltip tooltip="Username">
                  <div className="decoration-pink-500 select-none  underline underline-offset-2 hover:hover:underline-offset-4 hover:bg-white/10">
                    {token.username}
                  </div>
                </Tooltip>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="p-4 cursor-pointer z-0" onClick={logout}>
                    <Image
                      src={Logout}
                      width={35}
                      height={35}
                      alt="Logout"
                      priority
                      className="backdrop-blur-md hover:bg-white/10 p-[5px] rounded-lg"
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
      </RoomProvider>
    </SocketContext.Provider>
  );
};

export default withAuth(Room);

Room.getInitialProps = async (ctx: any) => {
  const { req, res } = ctx;
  if (req && res) {
    await fetch("http://localhost:3000/api/socket");
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
