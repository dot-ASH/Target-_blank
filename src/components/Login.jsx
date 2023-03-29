import React, { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import api from "../../data/api";
import "../styles/main.scss";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
   
        }
      );
      console.log(JSON.stringify(response.data.loggedIn));
      localStorage.setItem("loggedIn", JSON.stringify(response.data.loggedIn));
      localStorage.setItem("id", JSON.stringify(response.data.id));
      if (response.data.loggedIn) {
        window.location.href = "/profile";
        setUser("");
        setPwd("");
        setSuccess(true);
      } else {
        setErrMsg(response.data.status);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Login Failed! Wrong Credentials");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };
  return (
    <>
      {success ? (
        <section id="success-container w-full section  items-center justify-center">
          <div className=" flex flex-col section items-center h-full gap-[2rem] pt-[9rem]">
            <div className="items-center container justify-center w-full flex flex-col rounded-[5px] py-[5rem]">
              <div className="w-full items-center border-[0.1rem] border-[black] p-[6rem] rounded-[5px]">
                <h1 className="text-center">Success!</h1>
                <p>
                  <Link
                    to={"/profile"}
                    className="italic underline text-center"
                  >
                    Your Profile....
                  </Link>
                </p>
              </div>
              <Footer />
            </div>
          </div>
        </section>
      ) : (
        <section
          id="register"
          className="w-full section items-center justify-center"
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
                <form onSubmit={handleSubmit} className="reg-form">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
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
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                  />
                  <button className="bg-[#fefae0] text-[#081c15] mt-[1.5rem] p-[0.5rem] rounded-[5px]">
                    Sign In
                  </button>
                </form>
              </div>
            </div>
            <p>
              Need an Account? &nbsp;
              <Link to={"/register"} className="italic underline">
                Sign Up
              </Link>
            </p>
            <Footer />
          </div>
        </section>
      )}
    </>
  );
};

export default Login;
