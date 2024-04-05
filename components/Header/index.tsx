"use client";

import React, { useState, useEffect } from "react";
import { GiTireIronCross } from "react-icons/gi";
import Link from "next/link";
import "@/styles/main.scss";
import { useData } from "@/context/DataProvider";
// import api from "@/data/api";

const Header = () => {
  const { user } = useData();
  const [height, setHeight] = useState("6rem");

  const [showMenu, setShowMenu] = useState(0);

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setHeight("4rem");
    } else setHeight("6rem");
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`flex nav-container fixed w-[100vw] justify-center z-[5000]`}
      >
        <nav
          id="navbar"
          className={`navbar container bg-[#fefae0]`}
          style={{ height: height }}
        >
          <ul className="flex items-center flex-rows justify-between w-[33%]">
            <div>
              <li>
                <button onClick={() => setShowMenu(30)}>Menu</button>
              </li>
            </div>
          </ul>
          <div className="w-[33%]">
            <Link href="/">
              <span className="text-center">Target:_blank</span>
            </Link>
          </div>

          <ul className="flex flex-rows items-center justify-end w-[33%] gap-[10%]">
            {user ? (
              <>
                <li>
                  <Link href="/search">Search</Link>
                </li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/search">Search</Link>
                </li>
                <li>
                  <Link href="/login">login</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div
          className={`fixed top-[0] left-[0] h-[100vh]  border-r-[0.1rem] rounded-[10%] border-[black] bg-[#fefae0] z-[8000] duration-500 overflow-hidden`}
          style={{ width: showMenu + "%" }}
        >
          <div className="flex flex-col w-full p-[3rem]">
            <div className="flex justify-end p-[1rem]">
              <button onClick={() => setShowMenu(0)}>
                <div className="flex w-full items-center">
                  <GiTireIronCross className="text-right font-bold text-[20px]" />
                </div>
              </button>
            </div>
            <div className="flex flex-col justify-end items-end py-[1rem] my-[1rem]">
              {user
                ? `Hey, ${user && user.full_name}`
                : "You haven't logged in"}
              <div className="flex flex-col items-end text-[24px] font-bold my-[2rem] gap-[0.5rem]">
                <Link href={`/posts/sports`}>
                  <button>Sports</button>
                </Link>
                <Link href={`/posts/politics`}>
                  <button>Politics</button>
                </Link>
                <Link href={`/posts/fashion`}>
                  <button>Fashion</button>
                </Link>
                <Link href={`/posts/tech`}>
                  <button>Technology</button>
                </Link>
                <Link href={`/posts/music-film`}>
                  <button>Music-film</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
