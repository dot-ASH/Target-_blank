"use client";

import React, { useState, useRef, useEffect } from "react";
import api from "@/data/api";
import "@/styles/main.scss";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataProvider";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ChangePass = () => {
  const currentRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLInputElement>(null);
  const { users } = useData();

  const [currentPass, setCurrentPass] = useState<string>();

  const [newPass, setNewPass] = useState<string>("");
  const [validnewPass, setValidnewPass] = useState(false);
  const [newPassFocus, setnewPassFocus] = useState(false);

  const [matchNewPass, setMatchNewPass] = useState<string>();
  const [validMatchPass, setValidMatchPass] = useState(false);
  const [matchPassFocus, setMatchPassFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //   const fetchUser = async () => {
  //     const response = await api.get(`user/${localStorage.getItem("id")}`);
  //     setUsers(response.data);
  //     console.log(response.data[0].newsletter);
  //   };
  //   useEffect(() => {
  //     fetchUser();
  //   }, []);

  useEffect(() => {
    currentRef?.current?.focus();
  }, []);

  useEffect(() => {
    setValidnewPass(PWD_REGEX.test(newPass));
    setValidMatchPass(newPass === matchNewPass);
  }, [newPass, matchNewPass]);

  useEffect(() => {
    setErrMsg("");
  }, [currentPass, newPass, matchNewPass]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `change-pass/${localStorage.getItem("id")}`,
        JSON.stringify({
          currentPass,
          newPass,
          matchPass: matchNewPass,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data.error);
      if (response.data.error) {
        setErrMsg(response.data.errorType);
      }
      if (!response.data.error) {
        console.log(JSON.stringify(response));
        window.location.href = "/profile";
        // setUsers("");
        setSuccess(true);
      }
    } catch (err) {
      if (!err) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Login Failed");
      }
      console.log(err);
    }
    // }
  };

  return (
    <>
      {success ? (
        <section id="success-container w-full section  items-center justify-center">
          <div className=" flex flex-col section items-center h-full gap-[2rem] pt-[9rem]">
            <div className="items-center container justify-center w-full flex flex-col rounded-[5px] py-[5rem]">
              <div className="w-full items-center border-[0.1rem] border-[black] p-[6rem] rounded-[5px]">
                <h1 className="text-center">Password Changed!</h1>
                <p>
                  <Link
                    to={"/profile"}
                    className="italic underline text-center"
                  >
                    Your Profile....
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section
          id="change-pass"
          className="w-full section items-center justify-center"
        >
          <div className=" flex flex-col mt-[6rem] container justify-between min-h-screen">
            <div className="content-body">
              <div className="flex flex-col items-center justify-center my-[2rem]">
                <h1 className=" uppercase font-bold my-[3rem]  ml-[-1rem]">
                  ~ Change Password ~
                </h1>
                <form
                  onSubmit={handleSubmit}
                  className="bg-[#081c15] w-[50%] input flex flex-col gap-[1rem] p-[3rem] px-[5rem] rounded-[5px] "
                >
                  <p
                    ref={errRef}
                    className={
                      errMsg
                        ? "errmsg mt-[-2rem] py-[2rem] border-[#fefae0] border-[0.1rem] text-center"
                        : "errmsg-hide"
                    }
                    aria-live="assertive"
                  >
                    {errMsg} <br />
                  </p>
                  <p>
                    {users[0] && users[0].full_name}, Change your password!
                    <br />
                  </p>
                  <label htmlFor="current-password">Current Password:</label>
                  <input
                    type="password"
                    id="current-password"
                    ref={currentRef}
                    autoComplete="off"
                    onChange={(e) => setCurrentPass(e.target.value)}
                    value={currentPass}
                    required
                  />

                  <label htmlFor="new-password">
                    New Password:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validnewPass ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        validnewPass || !newPassFocus ? "hide" : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    autoComplete="off"
                    onChange={(e) => setNewPass(e.target.value)}
                    value={newPass}
                    required
                    aria-invalid={validnewPass ? "false" : "true"}
                    aria-describedby="newnote"
                    onFocus={() => setnewPassFocus(true)}
                    onBlur={() => setnewPassFocus(false)}
                  />
                  <p
                    id="newnote"
                    className={
                      newPassFocus && !validnewPass
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    &nbsp; 8 to 24 characters.
                    <br />
                    Must include uppercase and lowercase letters, a number and a
                    special character.
                    <br />
                    Allowed special characters:{" "}
                    <span aria-label="exclamation mark">!</span>{" "}
                    <span aria-label="at symbol">@</span>{" "}
                    <span aria-label="hashtag">#</span>{" "}
                    <span aria-label="dollar sign">$</span>{" "}
                    <span aria-label="percent">%</span>
                  </p>

                  <label htmlFor="re-password">
                    Retype Password:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validMatchPass ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={
                        !matchPassFocus || validMatchPass ? "hide" : "invalid"
                      }
                    />
                  </label>
                  <input
                    type="password"
                    id="re-password"
                    autoComplete="off"
                    onChange={(e) => setMatchNewPass(e.target.value)}
                    value={matchNewPass}
                    required
                    aria-invalid={validnewPass ? "false" : "true"}
                    aria-describedby="matchnote"
                    onFocus={() => setMatchPassFocus(true)}
                    onBlur={() => setMatchPassFocus(false)}
                  />
                  <p
                    id="matchnote"
                    className={
                      matchPassFocus && !validMatchPass
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    &nbsp; Doesn't match the new password!
                  </p>

                  <div className="pt-[1.5rem] bg-[] flex items-center justify-center">
                    <button className="bg-[#fefae0] p-[0.5rem] rounded-[5px]">
                      Confirm Change
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default ChangePass;
