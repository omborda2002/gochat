import React, { FC, useEffect } from "react";
import "@/app/gossip.css";
import withAuth from "@/app/withAuth";
import Image from "next/image";
import Copy from "@/images/copy.svg";
import Logout from "@/images/logout.svg";
import { motion } from "framer-motion";
import Router, { useRouter } from "next/router";

const Gossip: FC = () => {
  const router = useRouter();
  const { slug } = router.query;

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
  }, []);

  const deleteCookie = (name: any) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  return (
    <div className="px-[100px] py-[50px] flex min-w-[100vw] min-h-[100vh] h-full">
      <div className="blocker w-full text-white">
        <div className="w-full  bg-white rounded-t-[30px] text-black">
          <div className="w-auto h-14 px-8 grid grid-rows-1 grid-flow-col gap-4 ease-in-out duration-[1s]">
            <div className="flex flex-row justify-start items-center ">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
      </div>
    </div>
  );
};

export default withAuth(Gossip);
