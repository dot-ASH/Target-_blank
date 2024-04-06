"use client";

import React, { Fragment } from "react";
import api from "@/data/api";
import "@/styles/main.scss";
import { AiOutlineProfile } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { useData } from "@/context/DataProvider";
import { CldImage } from "next-cloudinary";

const Profile = () => {
  const { user, refreshModule } = useData();

  function logOut() {
    console.log("Logged Out");
    window.location.href = "/";
  }

  const subsCribe = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `users/newsletter`,
        JSON.stringify({
          newsletter: true,
          id: user?.id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      refreshModule();
    } catch (err) {
      console.log(err);
    }
  };

  const unsubsCribe = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `users/newsletter`,
        JSON.stringify({
          newsletter: false,
          id: user?.id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      refreshModule();
    } catch (err) {
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
                {user?.thumb ? (
                  <CldImage
                    src={user.thumb}
                    className=" object-cover w-full h-full"
                    alt=""
                    width={500}
                    height={500}
                    quality={50}
                  />
                ) : (
                  <CgProfile className="ml-[-6rem] mt-[-4rem] text-[30rem]" />
                )}
              </div>

              <div className="flex flex-col text-center gap-[1rem]">
                {user && (
                  <Fragment>
                    <h1 className="font-bold text-2xl">
                      {user.full_name || "Havent Provide a name"}
                    </h1>
                    <h1>{user.email}</h1>
                    <div className="italic">
                      {user.newsletter ? (
                        <>
                          <p>You have subscribed to our newsletter</p>
                          <button onClick={unsubsCribe} className="underline">
                            <br />
                            click here to unsubscribe
                          </button>
                        </>
                      ) : (
                        <>
                          <p>You haven't subscribed to our newsletter</p>
                          <button onClick={subsCribe} className="underline">
                            <br />
                            click here to subscribe
                          </button>
                        </>
                      )}
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
            <div className="flex flex-col text-center gap-[1rem] italic underline mt-[-4rem] ml-[-4rem] text-[18px]">
              <Link
                href="/profile/edit-profile"
                className="text-left flex gap-[1rem]"
              >
                <AiOutlineProfile className="mt-[0.2rem]" />
                Edit Profile
              </Link>
              <Link
                href="/profile/change-pass"
                className="text-left flex gap-[1rem]"
              >
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
        </div>
      </section>
    </>
  );
};

export default Profile;
