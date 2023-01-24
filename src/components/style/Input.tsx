import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface InputProps {
  text: string;
  type: string;
}

const Input = (props: InputProps) => {
  return (
    <div className="group relative w-72 md:w-80 lg:w-96">
      <label
        htmlFor="4"
        className="block w-full pb-1 text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-rose-400 capitalize"
      >
        {props.text}
      </label>
      <input
        id="4"
        type={props.type}
        className="peer h-10 w-full rounded-md bg-gray-800/75 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:ring-rose-500 focus:shadow-md focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800/75"
      />
      <span className="absolute block pt-1 text-xs font-semibold text-gray-500 opacity-0 transition-all duration-200 ease-in-out group-focus-within:opacity-100">
        Helper text: format xx-xxx
      </span>
    </div>
  );
};

export default Input;
