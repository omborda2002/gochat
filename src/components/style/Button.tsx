import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const Button = (props: any) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Link href={props.href || ""}>
        <button
          type={props.type ? props.type : "button"}
          className={clsx(
            "relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group",
            props.width ? " w-[200px]" : ""
          )}
          {...props}
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-rose-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
          <span className="relative">{props.text}</span>
        </button>
      </Link>
    </motion.div>
  );
};

export default Button;
