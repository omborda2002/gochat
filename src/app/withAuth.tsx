import Router from "next/router";
import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { NextPageContext } from "next";
import decode from "jwt-decode";
import Cookie from "cookie";

const secret =
  "mOvLC9lJQHxQoboK0aYfqTFdF18dYQgtf9iRhEUNXU5OQ97VhyRXqwrV7MoyPbNCdKu9SmSlY6i02mNY5n075fEz9Ymk4PBbOvLzIPNce8CwNWzooX9WMwf1qkVhSc6soIkAefwfw";

const withAuth = (WrappedComponent: any) => {
  const WithAuth = (props: any) => {
    useEffect(() => {
      (async () => {
        const token = localStorage.getItem("accesstoken");
        if (!token) return Router.push("/auth/login");
        try {
          // eslint-disable-next-line
          const { exp }: any = decode(token);

          if (exp < new Date().getTime() / 10000) {
            Router.push("/auth/login");
          }
        } catch (e) {
          console.log("ERROR : ", e);
          Router.push("/auth/login");
        }
      })();
    }, []);

    return <WrappedComponent {...props} />;
  };

  WithAuth.getInitialProps = async (ctx: NextPageContext) => {
    const token = Cookie.parse(ctx.req?.headers.cookie || "");
    if (token.accesstoken) {
      try {
        const decoded = jwt.verify(token.accesstoken, secret);
        ctx.user = decoded;
      } catch (err) {
        ctx.res?.writeHead(302, { Location: "/auth/login" });
        ctx.res?.end();
      }
    } else {
      ctx.res?.writeHead(302, { Location: "/auth/login" });
      ctx.res?.end();
    }
    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));
    return { ...componentProps, user: ctx.user?._doc };
  };

  return WithAuth;
};

export default withAuth;
