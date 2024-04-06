"use client";

import React, { useState, useRef, useEffect } from "react";
import api from "@/data/api";
import "@/styles/main.scss";
import Link from "next/link";
import { login } from "@/lib/auth";
import { useData } from "@/context/DataProvider";

const Login = () => {
  const { refreshModule } = useData();

  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleLogin = async (formData: FormData) => {
    const user = {
      user: formData.get("username") as string,
      pwd: formData.get("password") as string,
    };

    try {
      const response = await api.post("/auth", JSON.stringify(user), {
        headers: { "Content-Type": "application/json" },
      });
      const userData = response.data;
      await login(userData);
      refreshModule();
      window.location.href = "/";
    } catch (err: any) {
      if (!err.response) {
        setErrMsg("Login Failed! try again");
      } else if (err.response.status === 401) {
        setErrMsg("Wrong Username or Password");
      } else if (err.response.status === 400) {
        setErrMsg("Bad request");
      } else {
        setErrMsg(err.response.statusText);
      }
      errRef?.current?.focus();
    }
  };

  return (
    <section
      id="register"
      className="w-full section items-center justify-center pb-[3rem]"
    >
      <div className=" flex flex-col container items-center h-full gap-[2rem] pt-[3rem]">
        <h1 className=" uppercase font-bold mt-[6rem]  ml-[-1rem]">
          ~ Login ~
        </h1>
        <div className="items-center justify-around  w-full flex flex-col">
          <div className="reg-content">
            <p
              ref={errRef}
              className={errMsg ? "errmsg text-[white]" : "errmsg-hide"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <form className="reg-form">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
              <button
                className="bg-[#fefae0] text-[#081c15] mt-[1.5rem] p-[0.5rem] rounded-[5px]"
                formAction={handleLogin}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
        <p>
          Need an Account? &nbsp;
          <Link href={"/auth/register"} className="italic underline">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
