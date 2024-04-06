"use client";

import React, { useState, useEffect } from "react";
import "@/styles/main.scss";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useData } from "@/context/DataProvider";
import api from "@/data/api";

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const Page = () => {
  const { user, refreshModule } = useData();

  const [fullname, setFullname] = useState<string>();
  const [thumb, setThumb] = useState<FileList | null>(null);
  const [thumbLink, setThumbLink] = useState(null);
  const [validThumbLink, setValidThumbLink] = useState(false);
  const [email, setEmail] = useState<string>();
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (email) {
      setValidEmail(EMAIL_REGEX.test(email));
    }
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [thumb, email, fullname]);

  const submitImage = () => {
    if (thumb) {
      const data = new FormData();
      data.append("file", thumb[0]);
      data.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUD_PRESET as string
      );
      data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME as string);

      fetch(process.env.NEXT_PUBLIC_UPLOAD_IMAGE as string, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setThumbLink(data.public_id);
          setValidThumbLink(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await api.put(
        `users`,
        JSON.stringify({
          thumb: thumbLink || user?.thumb,
          email: email || user?.email,
          full_name: fullname || user?.full_name,
          id: user?.id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSuccess(true);
      refreshModule();
    } catch (err) {
      if (!err) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Error");
      }
      console.log(err);
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
                    href={"/profile"}
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
          id="edit-profile"
          className="w-full section items-center justify-center"
        >
          <div className=" flex flex-col mt-[6rem] container justify-between min-h-screen">
            <div className="content-body flex flex-col">
              <div className=" flex flex-col items-center h-full gap-[2rem] pt-[3rem]">
                <h1 className=" uppercase font-bold   ml-[-1rem]">
                  ~ Edit Profile ~
                </h1>
                <div className="register-container w-[70%] items-center justify-around flex flex-col">
                  <div className="reg-content">
                    {errMsg && (
                      <p className="errmsg" aria-live="assertive">
                        {errMsg}
                      </p>
                    )}

                    <div className=" h-full p-[6rem] flex flex-col items-center justify-center gap-[2rem]">
                      <label htmlFor="thumb" className="text-[#fefae0]">
                        Upload Image:
                      </label>
                      <input
                        type="file"
                        id="thumb"
                        onChange={(e) => setThumb(e.target.files)}
                        aria-describedby="filenote"
                        className="bg-[#fefae0] p-[0.5rem] rounded-[5px]"
                        required
                      />
                      <p
                        id="filenote"
                        className={
                          thumb ? "instructions text-[#fefae0]" : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        &nbsp; Click upload once to save Image.
                      </p>
                      <button
                        onClick={submitImage}
                        className="text-[#081c15] bg-[#fefae0] p-[0.5rem] rounded-[5px]"
                      >
                        Upload
                      </button>{" "}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validThumbLink ? "text-[#fefae0]" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          validThumbLink || !thumb ? "hide" : "text-[#fefae0]"
                        }
                      />
                    </div>
                    <form
                      onSubmit={handleSubmit}
                      className="input flex flex-col gap-[1rem] mt-[-1rem] py-[4rem] px-[6rem] text-[#fefae0] border-[0.1rem] border-[#fefae0] mb-[4rem] rounded-[5px]"
                    >
                      <label htmlFor="fullname">Full Name:</label>
                      <input
                        type="text"
                        id="fullname"
                        autoComplete="off"
                        onChange={(e) => setFullname(e.target.value)}
                        value={fullname}
                        placeholder={user?.full_name || "What's Your Full Name"}
                      />
                      <label htmlFor="email">
                        Email:
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validEmail ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={validEmail || !email ? "hide" : "invalid"}
                        />
                      </label>
                      <input
                        type="text"
                        id="email"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        aria-invalid={validEmail ? "false" : "true"}
                        placeholder={user?.email as string}
                        aria-describedby="emailnote"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                      />
                      <p
                        id="emailnote"
                        className={
                          emailFocus && !validEmail
                            ? "instructions"
                            : "offscreen"
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Enter a email address.
                        <br />
                        Must contain a '@'.
                        <br />
                        followed by a domain
                      </p>

                      <button className="bg-[#fefae0] text-[#081c15] mt-[1.5rem] p-[0.5rem] rounded-[5px]">
                        Confirm Change
                      </button>
                    </form>
                  </div>
                </div>
                <div className="py-[3rem]"></div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Page;
