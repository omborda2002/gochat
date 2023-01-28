import React, { FC, useEffect, useState } from "react";
import "@/app/gossip.css";
import withAuth from "@/app/withAuth";
import Image from "next/image";
import Copy from "@/images/copy.svg";
import Logout from "@/images/logout.svg";
import RightArrow from "@/images/right-arrow.svg";
import Rocket from "@/images/rocket.svg";
import Search from "@/images/search.svg";
import Pattern from "@/images/pattern.svg";
import { motion, useCycle } from "framer-motion";
import Router, { useRouter } from "next/router";
import clsx from "clsx";
import { socket, SocketContext } from "@/context/socket";
import UserCard from "@/components/Gossip/UserCard";

const Gossip: FC = () => {
  const inputRef: any = React.useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useCycle(true, false);
  const router = useRouter();
  const { slug }: any = router.query;

  const logout = async () => {
    localStorage.removeItem("accesstoken");
    deleteCookie("accesstoken");
    console.log("CLEAR COOKIES SUCCESSFULLY");
    Router.push("/auth/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("accesstoken")) {
      Router.push("/auth/login");
    }
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const deleteCookie = (name: any) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  const sendMessage = (e: any) => {
    e.preventDefault();
    socket.emit("message", { message });
    setMessage("");
  };

  return (
    <SocketContext.Provider value={socket}>
      <div className="px-[100px] py-[50px] flex min-w-[100vw] min-h-[100vh] h-full">
        <div className="blocker w-full text-white flex flex-col ">
          <div className="w-full bg-white rounded-t-[30px] text-black z-[100000]">
            <div className="w-auto h-14 px-8 grid grid-rows-1 grid-flow-col gap-4 ease-in-out duration-[1s]">
              <div className="flex flex-row justify-start items-center ">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="cursor-pointer z-0 flex flex-row justify-center items-center">
                    <Image
                      src={Copy}
                      width={35}
                      height={35}
                      alt="Logout"
                      priority
                      className="backdrop-blur-md !text-black !fill-current p-[5px] rounded-lg"
                    />
                    <span onClick={() => navigator.clipboard.writeText(slug)}>
                      {slug}
                    </span>
                  </div>
                </motion.div>
              </div>

              <div className="text-black flex flex-col justify-center items-center font-semibold uppercase text-center leading-4 select-none">
                <span>
                  START
                  <br />
                  GOSSIP
                </span>
              </div>
              <div className="flex flex-row justify-end items-center ">
                <div className="decoration-pink-500 select-none underline underline-offset-2 hover:hover:underline-offset-4 hover:bg-black/10 uppercase cursor-pointer">
                  om bOrda
                </div>
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
                      className="backdrop-blur-md !text-black !fill-current p-[5px] rounded-lg"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="w-full flex-1 flex flex-row rounded-b-[30px] bg-[#272727]">
            <motion.div
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={clsx(
                open ? "!max-w-sm w-full" : "w-0",
                "h-full rounded-bl-[30px] relative"
              )}
            >
              <motion.div
                className="absolute bg-gray-500/70 right-[-25px] top-1/2 rounded-r-lg border-y-[1px] border-r-[1px] border-neutral-500/50 transition-transform z-[1000]"
                whileHover={{ shadow: "0 0 10px 5px #272727" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen()}
              >
                <Image
                  src={RightArrow}
                  width={25}
                  height={25}
                  blurDataURL={rgbDataURL(2, 129, 210)}
                  alt="OpenNav"
                  priority
                  className={clsx(
                    !open ? "" : "rotate-[180deg]",
                    "backdrop-blur-md text-white p-[5px] transition-transform"
                  )}
                />
              </motion.div>
              <div
                id="content-wrapper"
                className={clsx(
                  "w-full h-[calc(100vh_-_150px)] relative bg-transparent p-5 space-y-3 overflow-auto",
                  open ? "p-5" : "p-0"
                )}
              >
                <div className="group relative bg-[#272727]">
                  <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search"
                    className="peer h-10 w-full rounded-full bg-neutral-500/60 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:shadow-md text-white border border-gray-800/75"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    onClick={sendMessage}
                    className="z-10 h-full leading-snug font-normal absolute text-center text-slate-300 bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3"
                  >
                    <Image
                      src={Search}
                      width={50}
                      height={50}
                      blurDataURL={rgbDataURL(2, 129, 210)}
                      alt="Send Message"
                      priority
                    />
                  </motion.button>
                </div>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                  (i, key) => (
                    <div key={key}>
                      <UserCard />
                    </div>
                  )
                )}
              </div>
            </motion.div>
            <div
              className={clsx(
                open ? "!rounded-br-[30px]" : "!rounded-b-[30px]",
                "w-full h-full bg-black overflow-hidden flex flex-col"
              )}
            >
              <div
                className={clsx(
                  open
                    ? "w-[calc(100vw_-_585px)] h-[calc(100vh_-_160px)]"
                    : "w-[calc(100vw_-_200px)] h-[calc(100vh_-_160px)]",
                  " fixed z-[0]"
                )}
              >
                <Image
                  src={Pattern}
                  fill
                  blurDataURL={rgbDataURL(2, 129, 210)}
                  alt="OpenNav"
                  priority
                  className="object-center object-cover pointer-events-none !rounded-b-[30px]"
                />
              </div>
              <div className="text-white z-[100] bg-transparent flex-1">
                Messages
              </div>
              <div className="text-white z-[1000] bg-transparent h-[50px] px-3">
                <div className="w-full h-full flex flex-row justify-center items-center">
                  <form className="group relative w-full">
                    <input
                      value={message}
                      placeholder="Message"
                      ref={inputRef}
                      onChange={(e) => setMessage(e.target.value)}
                      type="text"
                      className="peer h-10 w-full rounded-full bg-gray-800 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:shadow-md text-white border border-gray-800/75"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="submit"
                      onClick={sendMessage}
                      className="z-10 h-full leading-snug font-normal absolute text-center text-slate-300 bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3"
                    >
                      <Image
                        src={Rocket}
                        width={50}
                        height={50}
                        blurDataURL={rgbDataURL(2, 129, 210)}
                        alt="Send Message"
                        priority
                      />
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SocketContext.Provider>
  );
};

export default withAuth(Gossip);

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
