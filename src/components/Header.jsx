import React, { useState, useEffect, useRef } from "react";
import { GiTireIronCross } from "react-icons/gi";
import { Link } from "react-router-dom";
import "../styles/main.scss";
import api from "../../data/api";

const Header = () => {
  const [height, setHeight] = useState("6rem");
  const loginState = useRef(localStorage.getItem("loggedIn"));

  const [showMenu, setShowMenu] = useState(0);
  const [user, setUser] = useState("");
  console.log("logged", localStorage.getItem("loggedIn"));
  const fetchUser = async () => {
    const response = await api.get(`user/${localStorage.getItem("id")}`);
    setUser(response.data);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = (event) => {
      if (window.scrollY > 10) {
        setHeight("4rem");
      } else setHeight("6rem");
    };
    window.addEventListener("scroll", handleScroll);
  }, []);

  function catToken(cat) {
    sessionStorage.removeItem("category");
    sessionStorage.setItem("category", cat);
  }

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
            <Link to="/">
              <span className="text-center">Target:_blank</span>
            </Link>
          </div>

          <ul className="flex flex-rows items-center justify-end w-[33%] gap-[10%]">
            {localStorage.getItem("id") ? (
              <>
                 <li>
                  <Link to="/search">Search</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
              </>
            ) : (
              <>
              <li>
              <Link to="/search">Search</Link>
            </li>
              <li>
                <Link to="/login">login</Link>
              </li>
              </>
            )}
          </ul>
        </nav>
        <div
          className={`fixed top-[0] left-[0] h-[100vh]  border-r-[0.1rem] rounded-[10%] border-[black] bg-[#fefae0] z-[8000] duration-500 overflow-hidden`}
          style= {{width: showMenu+'%'}}
        >
          <div className="flex flex-col w-full p-[3rem]">
            <div className="flex justify-end p-[1rem]">
              <button onClick={() => setShowMenu("0")}>
                <div className="flex w-full items-center">
                  {" "}
                  <GiTireIronCross className="text-right font-bold text-[20px]" />
                </div>
              </button>
            </div>
            <div className="flex flex-col justify-end items-end py-[1rem] my-[1rem]">
              {localStorage.getItem("id")
                ? `Hey, ${user[0] && user[0].full_name}`
                : "You haven't logged in"}
              <div className="flex flex-col items-end text-[24px] font-bold my-[2rem] gap-[0.5rem]">
                <a href={"/show-cat-post"}>
                  <button onClick={() => catToken("sports")}>Sports</button>{" "}
                </a>
                <a href={"/show-cat-post"}>
                  <button onClick={() => catToken("politics")}>Politics</button>{" "}
                </a>
                <a href={"/show-cat-post"}>
                  <button onClick={() => catToken("fashion")}>Fashion</button>{" "}
                </a>
                <a href={"/show-cat-post"}>
                  <button onClick={() => catToken("tech")}>Technology</button>{" "}
                </a>
                <a href={"/show-cat-post"}>
                  <button onClick={() => catToken("music-film")}>
                    Music-film
                  </button>{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
