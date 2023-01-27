import React, { useContext, useEffect, useState } from "react";
import ReactCodeInput from "react-code-input";
import Button from "../style/Button";
import { SocketContext } from "@/context/socket";

const Content = () => {
  const socket = useContext(SocketContext);
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

  const workingSubmit = async (e: any) => {
    e.preventDefault();
    checkPassword();
    if (password.length === 6 && isPasswordValid) {
      await socket.emit("join-room", password);
      console.log("WORKING", password);
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
        <Button text="Join Room" width onClick={workingSubmit} />
      </form>
    </div>
  );
};

export default Content;
