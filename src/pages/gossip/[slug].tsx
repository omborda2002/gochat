import React, { useCallback, useEffect, useState } from "react";
import "@/app/gossip.css";
import withAuth from "@/app/withAuth";
import { Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import Copy from "@/images/copy.svg";
import Logout from "@/images/logout.svg";
import RightArrow from "@/images/right-arrow.svg";
import Rocket from "@/images/rocket.svg";
import Search from "@/images/search.svg";
import Pattern from "@/images/pattern.svg";
import Back from "@/images/back.svg";
import { motion, useCycle } from "framer-motion";
import Router, { useRouter } from "next/router";
import clsx from "clsx";
import { socket, SocketContext } from "@/context/socket";
import UserCard from "@/components/Gossip/UserCard";
import { Fragment } from "react";
import useRoom from "@/context/RoomContext";

const Gossip = (PROPS: any) => {
  const inputRef: any = React.useRef<HTMLInputElement>(null);
  const divRef: any = React.useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useCycle(true, false);
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const {
    roomId,
    setRoomID,
    connectedUsers,
    setConnectedUsers,
    setDisconnectedUsers,
  } = useRoom();
  const { slug }: any = router.query;

  const logout = async () => {
    localStorage.removeItem("accesstoken");
    deleteCookie("accesstoken");
    console.log("CLEAR COOKIES SUCCESSFULLY");
    Router.push("/auth/login");
  };

  useEffect(() => {
    if (!roomId) setRoomID(slug);
    if (!localStorage.getItem("accesstoken")) {
      Router.push("/auth/login");
    }

    if (inputRef.current) inputRef.current.focus();

    if (divRef.current) divRef.current.scrollTo(0, divRef.current.scrollHeight);

    if (PROPS.user) {
      setName(PROPS?.user?.name);
    }
    checkRoomJoined();
    getallconnectedusers();

    const listener = (data: any) => {
      setConnectedUsers(data, PROPS?.user?._id);
    };
    socket.on("userconnected", listener);

    const listener2 = async (data: any) => {
      setDisconnectedUsers(data.currentUser_id);
    };

    socket.on("userdisconnected", listener2);

    return () => {
      socket.off("userconnected", listener);
      socket.off("userdisconnected", listener2);
    };
  }, []);

  const getallconnectedusers = async () => {
    if (PROPS.user) {
      const result = await fetch("/api/chat/getallconnectedusers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: slug }),
      });
      const data = await result.json();
      if (data.ok) {
        setConnectedUsers(data.list, PROPS?.user?._id);
      }
    }
  };
  const checkRoomJoined = async () => {
    if (PROPS.user) {
      const result = await fetch("/api/chat/checkroomjoined", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: PROPS?.user?._id }),
      });
      const { room } = await result.json();
      if (room) {
        await socket.emit("join-room", {
          roomId: room,
          user: PROPS?.user,
        });
        setRoomID(room);
        await Router.push("/gossip/[slug]", `/gossip/${room}`);
      } else {
        await Router.push("/room");
      }
    }
  };

  const deleteCookie = (name: any) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!message) return;

    await socket.emit("message", { message });
    setMessage("");
  };

  const disconnectingUser = async () => {
    const result = await fetch("/api/chat/disconnectinguser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: slug,
        userId: PROPS.user._id,
      }),
    });
    const data = await result.json();
    return data;
  };

  const LeaveRoom = useCallback(async () => {
    if (PROPS?.user) {
      await disconnectingUser();
      await socket.emit("leave-room", { roomId: slug });
      await Router.push("/room");
    }
  }, [slug]);

  return (
    <SocketContext.Provider value={socket}>
      <div className="px-[100px] py-[25px] flex min-w-[100vw] min-h-[100vh] h-full">
        <div className="blocker w-full text-white flex flex-col ">
          <div className="w-full bg-white rounded-t-[30px] text-black z-[100000]">
            <div className="w-auto h-14 px-8 grid grid-rows-1 grid-flow-col gap-4 ease-in-out duration-[1s]">
              <div className="flex flex-row justify-start items-center space-x-2">
                <PopOver LeaveRoom={LeaveRoom}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="cursor-pointer z-0 flex flex-row justify-center items-center">
                      <Image
                        src={Back}
                        width={35}
                        height={35}
                        alt="Logout"
                        priority
                        className="backdrop-blur-md !text-black !fill-current p-[5px] rounded-lg"
                      />
                    </div>
                  </motion.div>
                </PopOver>
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
                  {name}
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
            <div
              className={clsx(
                open ? "!max-w-sm w-full" : "w-0",
                "h-full rounded-bl-[30px] relative"
              )}
            >
              <motion.div
                className="absolute bg-gray-500/70 right-[-25px] top-1/2 rounded-r-lg border-y-[1px] border-r-[1px] border-neutral-500/50 transition-transform z-[1000] cursor-pointer"
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
              {open && (
                <div className="group relative bg-[#272727] px-5 py-3">
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
                    className="z-10 mr-5 leading-snug font-normal absolute text-center text-slate-300 bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3 pt-[0.60rem]"
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
              )}
              <div
                className={clsx(
                  "content-wrapper w-full h-[calc(100vh_-_150px)] relative bg-transparent p-5 pt-0 space-y-3 overflow-auto",
                  open ? "p-5" : "p-0"
                )}
              >
                {connectedUsers.length > 0 ? (
                  connectedUsers.map((i, key) => (
                    <div key={key}>
                      <UserCard data={i} />
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-700/50 text-center text-gray-200 rounded-xl p-5 text-sm">
                    Users Not Connected
                    <br />
                    <span className="text-xs text-gray-400">
                      You only one alive!
                    </span>
                  </div>
                )}
              </div>
            </div>
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
                  "fixed z-[0]"
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
                <div
                  ref={divRef}
                  className="content-wrapper2 flex flex-col space-y-2 p-4 h-[calc(100vh_-_140px)] overflow-y-scroll"
                >
                  <Message
                    text="Hello, how are you? lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem
                    ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur"
                    sender="John"
                    timestamp="10:30 AM"
                    isSender={false}
                  />
                  <Message
                    text="I'm good, thanks for asking!"
                    sender="Jane"
                    timestamp="10:31 AM"
                    isSender={true}
                  />
                  <Message
                    text="I'm good, thanks for asking!"
                    sender="Jane"
                    timestamp="10:31 AM"
                    isSender={true}
                  />
                  <Message
                    text="Hello, how are you? lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem
                    ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur"
                    sender="John"
                    timestamp="10:30 AM"
                    isSender={false}
                  />
                  <Message
                    text="Hello, how are you? lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem
                    ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur"
                    sender="John"
                    timestamp="10:30 AM"
                    isSender={false}
                  />
                  <Message
                    text="I'm good, thanks for asking!"
                    sender="Jane"
                    timestamp="10:31 AM"
                    isSender={true}
                  />
                  <Message
                    text="Hello World"
                    sender="John"
                    timestamp="10:30 AM"
                    isSender={false}
                  />
                </div>
              </div>
              <div className="text-white z-[1000] bg-transparent h-[50px] px-3">
                <div className="w-full h-full flex flex-row justify-center items-center">
                  <form className="group relative w-full mb-3">
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

const Message = ({ text, sender, timestamp, isSender }: any) => {
  return (
    <div
      className={clsx(
        isSender
          ? "self-end  rounded-l-2xl rounded-br-2xl rounded-tr-md"
          : "self-start rounded-r-2xl rounded-bl-2xl rounded-tl-md",
        "bg-[#272727] px-2 py-2 !pb-1 w-fit max-w-md"
      )}
    >
      <div className="text-xs text-rose-500 font-semibold">{sender}</div>
      <div className="text-white text-sm">{text}</div>
      <div className="text-xs text-gray-500 flex flex-row justify-end select-none">
        {timestamp}
      </div>
    </div>
  );
};

const PopOver = ({ children, LeaveRoom }: any) => {
  return (
    <Popover className="relative !mt-2">
      <Popover.Button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        {children}
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute -left-1/2 z-10 border border-neutral-500 shadow-sm bg-[#272727] p-5 rounded-lg min-w-fit space-y-2">
          <div className="text-white whitespace-nowrap select-none">
            Leave Room ?
          </div>

          <div
            onClick={LeaveRoom}
            className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-red-500 rounded-xl group cursor-pointer"
          >
            <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-red-700 rounded group-hover:-mr-4 group-hover:-mt-4">
              <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
            </span>
            <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full bg-red-600 rounded-2xl group-hover:mb-12 group-hover:translate-x-0"></span>
            <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white whitespace-nowrap">
              Leave Room
            </span>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

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

Gossip.getInitialProps = async (ctx: any) => {
  return {
    props: {
      name: "Hello",
    },
  };
};
