import React from "react";
import { motion } from "framer-motion";

interface TooltipProps {
  children?: React.ReactNode;
  tooltip: string;
}

const Tooltip = ({ children, tooltip }: TooltipProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1, zIndex: 10000 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="group cursor-pointer relative inline-block w-auto text-center z-10">
          {children}
          <div className="opacity-0 w-28 bg-white text-black text-center text-xs rounded-lg py-2 absolute z-[10000] group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none ">
            {tooltip}
            <svg
              className="absolute text-white h-2 w-full left-0 top-full"
              x="0px"
              y="0px"
              viewBox="0 0 255 255"
              xmlSpace="preserve"
            >
              <polygon
                className="fill-current"
                points="0,0 127.5,127.5 255,0"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Tooltip;
