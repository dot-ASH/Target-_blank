import React, { useState, useEffect } from "react";
import api from "../../data/api";
import axios from "axios";
import Footer from "./Footer";
import Myposts from "./Myposts";
import Mysave from "./Mysave";
import Mycomment from "./Mycomment";
import { GoPlus } from "react-icons/go";
import CreatePost from "./CreatePost";
import Tippy from "@tippyjs/react";

const Dashboard = () => {
  const [user, setUser] = useState([]);
  const [myPost, setmyPost] = useState(true);
  const [mySave, setmySave] = useState(false);
  const [myComment, setComment] = useState(false);
  const [showCreateBtn, setShowCreateBtn] = useState("mx-[-5rem]");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [height, setHeight] = useState("5rem");
  const fetchUser = async () => {
    const response = await api.get(`user/${localStorage.getItem("id")}`);
    setUser(response.data);
  };

  const handleScroll = (event) => {
    if (window.scrollY > 10) {
      setHeight("4rem");
      setShowCreateBtn("mx-[7rem]");
    } else {
      setHeight("5rem");
      setShowCreateBtn("mx-[-7rem]");
    }
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener("scroll", handleScroll);
  }, []);
  const showPost = () => {
    setmyPost(true);
    setmySave(false);
    setComment(false);
  };
  const showSave = () => {
    setmyPost(false);
    setmySave(true);
    setComment(false);
  };
  const showComment = () => {
    setmyPost(false);
    setmySave(false);
    setComment(true);
  };

  const createBtn = () => {
    document.body.style.overflow = "hidden";
    document.getElementById("create-post").style.display = "block";
    showCreatePost(true);
  };

  console.log(user[0] && user[0].full_name);
  return (
    <>
      <section
        id="dashboard"
        className="w-full section items-center justify-center overflow-hidden bodyFreeze "
      >
        <div className=" flex flex-col mt-[6rem] container justify-between min-h-screen">
          <div className="content-body flex flex-col w-full min-h-[40rem] ">
            <h1 className=" uppercase font-bold text-center my-[3rem]">
              ~ dashboard ~
            </h1>
            <div className="dash-nav w-full flex items-center justify-center gap-[2rem] mt-[-1rem] mb-[2rem]">
              <button
                onClick={showPost}
                className={myPost ? "underline" : "no-underline"}
              >
                <p>My Posts</p>
              </button>
              <button
                onClick={showSave}
                className={mySave ? "underline" : "no-underline"}
              >
                <p>My Saves</p>
              </button>
              <button
                onClick={showComment}
                className={myComment ? "underline" : "no-underline"}
              >
                <p> My Comments</p>
              </button>
            </div>
            <div className="py-[5rem] border-t-[0.1rem] border-[#081c15]">
              {myPost ? <Myposts className="1rem" /> : <br />}
              {mySave ? <Mysave className="1rem" /> : <br />}
              {myComment ? <Mycomment className="1rem" /> : <br />}
            </div>
          </div>
          <Tippy content={"Click to create post"}>
            <div
              className={`fixed bottom-0 right-0 ${showCreateBtn} mb-[5rem] rounded-[50%] w-[4rem] h-[4rem] bg-[#fefae0] flex  items-center justify-center border-[0.1rem] border-[#081c15] text-[#081c15] hover:bg-[#081c15] hover:text-[#fefae0] duration-500 hover:border-[#fefae0]`}
            >
              <button onClick={() => createBtn()} className=" react-star">
                <GoPlus className="text-[32px] " />
              </button>
            </div>
          </Tippy>
          <CreatePost />
          <Footer></Footer>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
