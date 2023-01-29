import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import ReactCodeInput from "react-code-input";
import Button from "../style/Button";
import { SocketContext } from "@/context/socket";
import useRoom from "@/context/RoomContext";
import Router from "next/router";

const Content = ({ user }: any) => {
  const socket = useContext(SocketContext);
  const [room, setroom] = useState("");
  const [btnIsPressed, setBtnIsPressed] = useState(false);
  const [isroomValid, setIsroomValid] = useState(true);
  const [width, setWidth] = useState<any>(0);
  const { roomId, setRoomID } = useRoom();

  useEffect(() => {
    setWidth(window.innerWidth);
    checkRoomJoined();
  }, []);

  const checkRoomJoined = async () => {
    if (user) {
      const result = await fetch("/api/chat/checkroomjoined", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user._id }),
      });
      const { room } = await result.json();
      if (room) {
        await socket.emit("join-room", { roomId: room, user: user });
        setRoomID(room);
        await Router.push("/gossip/[slug]", `/gossip/${room}`);
      }
    }
  };

  const checkroom = () => {
    const isroomValid = room.length === 6;
    setBtnIsPressed(true);
    setIsroomValid(isroomValid);
    if (!isroomValid) setroom("");
  };

  const handlePinChange = (room: any) => {
    setroom(room);
    setBtnIsPressed(false);
  };

  const propsStyle = {
    inputStyle: {
      margin: parseInt(width) < 768 ? "2px" : "8px",
      MozAppearance: "textfield",
      marginLeft: "0px",
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

  const connectingUser = async () => {
    const result = await fetch("/api/chat/connectinguser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: room,
        currentUser_id: user._id,
        name: user.name,
        username: user.username,
      }),
    });
    const data = await result.json();
    return data;
  };

  const workingSubmit = async (e: any) => {
    e.preventDefault();
    if (user) await connectingUser();
    checkroom();
    if (room.length === 6 && isroomValid) {
      await socket.emit("join-room", {
        roomId: room,
        user,
      });
      await setRoomID(room);
      await Router.push("/gossip/[slug]", `/gossip/${room}`);
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
            id="room"
            type="room"
            autoFocus={false}
            isValid={isroomValid}
            fields={6}
            onChange={handlePinChange}
            value={room}
            className="!w-full !flex !justify-between !items-center"
            {...propsStyle}
          />
        </div>
        <Button text="Join Room" width onClick={workingSubmit} />
      </form>
    </div>
  );
};

export default Content;
