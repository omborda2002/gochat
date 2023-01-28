import multiavatar from "@multiavatar/multiavatar";
import clsx from "clsx";
import React, { FC, useEffect, useRef } from "react";

const randomColor = [
  {
    bgColor: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
    textColor: "text-white",
  },
  {
    bgColor: "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600",
    textColor: "text-white",
  },
  {
    bgColor: "bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500",
    textColor: "text-black",
  },
  {
    bgColor: "bg-gradient-to-r from-yellow-200 via-green-200 to-green-500",
    textColor: "text-black",
  },
  {
    bgColor: "bg-gradient-to-r from-red-200 via-red-300 to-yellow-200",
    textColor: "text-black",
  },
  {
    bgColor: "bg-gradient-to-r from-green-200 via-green-300 to-blue-500",
    textColor: "text-black",
  },
  {
    bgColor: "bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700",
    textColor: "text-black",
  },
  {
    bgColor: "bg-gradient-to-r from-red-200 to-red-600",
    textColor: "text-black",
  },
  {
    bgColor: "bg-gradient-to-r from-green-300 via-yellow-300 to-pink-300",
    textColor: "text-black",
  },
  {
    bgColor: "bg-gradient-to-r from-indigo-300 to-purple-400",
    textColor: "text-black",
  },
  {
    bgColor: "bg-gradient-to-r from-green-200 to-green-500",
    textColor: "text-black",
  },
  {
    bgColor: "bg-gradient-to-r from-red-800 via-yellow-600 to-yellow-500",
    textColor: "text-black",
  },
  {
    bgColor: "bg-gradient-to-r from-rose-500 via-red-400 to-red-500",
    textColor: "text-white",
  },
  {
    bgColor: "bg-gradient-to-r from-pink-400 to-pink-600",
    textColor: "text-black",
  },
];

const UserCard: FC = () => {
  const image: any = useRef(null);
  useEffect(() => {
    (async () => {
      const svg = await multiavatar(
        String(Math.floor(Math.random() * 1000 + 1))
      );
      if (!image.current.innerHTML) image.current.innerHTML = svg;
    })();
  }, []);

  const getRandomColor = () => {
    const random = Math.floor(Math.random() * randomColor.length);
    let str = randomColor[random].bgColor;
    str = str + " " + randomColor[random].textColor;
    return str;
  };

  return (
    <div
      className={clsx(
        "w-full rounded-lg flex flex-row justify-start space-x-3 items-center p-3",
        getRandomColor()
      )}
    >
      <div className="relative inline-block rounded-full">
        <div
          ref={image}
          className="inline-block object-cover w-12 h-12 rounded-full"
        ></div>
        <span className="absolute bottom-0 right-0 inline-block w-3 h-3 bg-green-600 border-2 border-white rounded-full"></span>
      </div>
      <div className="capitalize text-xl">User Name</div>
    </div>
  );
};

export default UserCard;
