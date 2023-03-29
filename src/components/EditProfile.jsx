import React, { useState, useRef, useEffect } from "react";
import "../styles/main.scss";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import api from "../../data/api";

const EditProfile = () => {
  const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const userRef = useRef();
  const errRef = useRef();

  const [users, setUsers] = useState([]);
  const fetchUser = async () => {
    const response = await api.get(`user/${localStorage.getItem("id")}`);
    setUsers(response.data);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const [fullname, setFullname] = useState(null);
  const [thumb, setThumb] = useState("");

  const [thumbLink, setThumbLink] = useState(null);
  const [validThumbLink, setValidThumbLink] = useState(false);

  const [email, setEmail] = useState(null);
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [thumb, email, fullname]);

 
  const submitImage = () => {
     console.log(thumb)
    const data = new FormData();
    data.append("file", thumb);
    data.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

    fetch(import.meta.env.VITE_UPLOAD_IMAGE, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setThumbLink(data.url);
        setValidThumbLink(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `user/${localStorage.getItem("id")}`,
        JSON.stringify({
          thumb: thumbLink || (users[0] && users[0].thumb),
          email: email || (users[0] && users[0].email),
          fullname: fullname || (users[0] && users[0].full_name),
        }),
        {
          headers: { "Content-Type": "application/json" },
   
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      window.location.href = "/profile";

      setUsers("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Login Failed");
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
                    <p
                      ref={errRef}
                      className={errMsg ? "errmsg" : "errmsg-hide"}
                      aria-live="assertive"
                    >
                      {errMsg}
                    </p>

                    <div className=" h-full p-[6rem] flex flex-col items-center justify-center gap-[2rem]">
                      <label htmlFor="thumb" className="text-[#fefae0]">
                        Upload Image:
                      </label>
                      <input
                        type="file"
                        id="thumb"
                        onChange={(e) => setThumb(e.target.files[0])}
                        aria-describedby="filenote"
                        className="bg-[#fefae0] p-[0.5rem] rounded-[5px]"
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
                      </button>  <FontAwesomeIcon
                          icon={faCheck}
                          className={validThumbLink ? "text-[#fefae0]" : "hide"}
                        /><FontAwesomeIcon
                        icon={faTimes}
                        className={validThumbLink || !thumb ? "hide" : "text-[#fefae0]"}
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
                        placeholder={
                          (users[0] && users[0].full_name) ||
                          "What's Your Full Name"
                        }
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
                        placeholder={users[0] && users[0].email}
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
            <Footer></Footer>
          </div>
        </section>
      )}
    </>
  );
};

export default EditProfile;
