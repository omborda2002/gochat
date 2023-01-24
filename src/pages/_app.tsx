import "@/app/globals.css";
import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css";
import { Toaster } from "react-hot-toast";
// import PageLoader from "@/components/style/PageLoader";

export default function MyApp({
  Component,
  pageProps,
  router: Router,
}: AppProps) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Used for page transition
    const start = () => {
      NProgress.start();
      setLoading(true);
    };
    const end = () => {
      NProgress.done();
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  
  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <Component {...pageProps} key={Router.asPath} />
      <Toaster />
    </AnimatePresence>
  );
}
