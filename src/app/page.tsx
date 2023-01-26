'use client';
import { IBM_Plex_Mono } from "@next/font/google";
import Image from "next/image";
import Logo from "@/images/logo.png";
import clsx from "clsx";
import Button from "@/components/style/Button";
import Plan from "@/images/plan.svg";
import Link from "next/link";
const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  return (
    <div
      className={clsx(
        "w-full md:px-[100px] md:py-[80px] px-[40px] py-[100px]",
        ibm.className
      )}
    >
      <Header />
      <Content />
    </div>
  );
}

export const Header = () => {
  return (
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
  );
};

const Content = () => {
  return (
    <div className="flex flex-col md:ml-2 h-full md:w-full">
      <p className="text-lg text-gray-500 text-center md:text-left mt-4 md:mt-0">
        You can chat with just name and your secret code.
      </p>
      <div className="flex flex-col space-y-4 w-full h-full justify-center items-center mt-[-80px]">
        <Button text="Login" href="/auth/login" width={"true"} />
        <br></br>
        <Button text="Register" href="/auth/register" width={"true"} />
      </div>
    </div>
  );
};
