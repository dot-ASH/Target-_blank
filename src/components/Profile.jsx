import React, { useState, useEffect } from "react";
import api from "../../data/api";
import Footer from "./Footer";
import "../styles/main.scss";
import { AiOutlineProfile } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [loginState, setLoginState] = useState(false);
  
  const fetchUser = async () => {
    const response = await api.get(`user/${localStorage.getItem("id")}`);
    setUsers(response.data);
    console.log(response.data[0].newsletter);
  };
  useEffect(() => {
    fetchUser();
  }, []);
  console.log(localStorage.getItem("id"));

  function logOut() {
    console.log("Logged Out");
    localStorage.setItem("loggedIn", false);
    localStorage.removeItem("id");
    window.location.href = "/";
  }

  const subsCribe = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `newsletter/${localStorage.getItem("id")}`,
        JSON.stringify({}),
        {
          headers: { "Content-Type": "application/json" },
   
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      window.location.href = "/profile";
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log("...");
      }
      console.log(err);
    }
  };

  const unsubsCribe = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `newsletter/unsubscribe/${localStorage.getItem("id")}`,
        JSON.stringify({}),
        {
          headers: { "Content-Type": "application/json" },
   
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      window.location.href = "/profile";
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log("...");
      }
      console.log(err);
    }
  };

  return (
    <>
      <section
        id="profile"
        className="w-full section items-center justify-center"
      >
             <div className=" flex flex-col mt-[6rem] container justify-between min-h-screen">
          <div className="profile-container items-center justify-around h-[80vh] w-full flex p-[2rem] my-[2rem]">
            <div className="basic-profile flex flex-col items-center gap-[2rem]">
              <div className="relative w-[300px] h-[350px] rounded-[50%] border-[0.1rem] border-[#081c15] overflow-hidden">
                {users[0] && (
                  <>
                    {users[0].thumb ? (
                      <img
                        src={users[0].thumb}
                        className=" object-cover w-full h-full"
                      />
                    ) : (
                      <CgProfile className="ml-[-6rem] mt-[-4rem] text-[30rem]" />
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-col text-center gap-[1rem]">
                {" "}
                {users[0] && (
                  <>
                    <h1 className="font-bold text-2xl">
                      {users[0].full_name || "Havent Provide a name"}
                    </h1>
                    <h1>{users[0].email}</h1>
                    <div className="italic">
                      {users[0].newsletter ? (
                        <>
                          <p>You have subscribed to our newsletter</p>
                          <button onClick={unsubsCribe} className="underline">
                            {" "}
                            <br />
                            click here to unsubscribe
                          </button>
                        </>
                      ) : (
                        <>
                          <p>You haven't subscribed to our newsletter</p>
                          <button onClick={subsCribe} className="underline">
                            {" "}
                            <br />
                            click here to subscribe
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col text-center gap-[1rem] italic underline mt-[-4rem] ml-[-4rem] text-[18px]">
              <Link to="/edit-profile" className="text-left flex gap-[1rem]">
                <AiOutlineProfile className="mt-[0.2rem]" />
                Edit Profile
              </Link>
              <Link to="/change-pass" className="text-left flex gap-[1rem]">
                <RiLockPasswordLine className="mt-[0.2rem]" />
                Change Password
              </Link>
              <button
                onClick={logOut}
                className="text-left flex gap-[1rem] italic underline"
              >
                <FiLogOut className="mt-[0.2rem]" />
                Log Out
              </button>
            </div>
          </div>
          <Footer></Footer>
        </div>
      </section>
    </>
  );
};

export default Profile;
