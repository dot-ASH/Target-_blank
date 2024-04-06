"use client";

import React, { useState } from "react";
import Myposts from "@/components/dashboard/Myposts";
import Mysave from "@/components/dashboard/Mysave";
import Mycomment from "@/components/dashboard/Mycomment";
import { GoPlus } from "react-icons/go";

import Tippy from "@tippyjs/react";
import CreatePost from "@/components/dashboard/CreatePost";

const Page = () => {
  const [myPost, setmyPost] = useState(true);
  const [mySave, setmySave] = useState(false);
  const [myComment, setComment] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);

  const showPost = () => {
    setmyPost(true);
    setmySave(false);
    setComment(false);
    setShowCreatePost(false);
  };
  const showSave = () => {
    setmyPost(false);
    setmySave(true);
    setComment(false);
    setShowCreatePost(false);
  };
  const showComment = () => {
    setmyPost(false);
    setmySave(false);
    setComment(true);
    setShowCreatePost(false);
  };

  return (
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
            {myPost ? <Myposts /> : <br />}
            {mySave ? <Mysave /> : <br />}
            {myComment ? <Mycomment /> : <br />}
          </div>
        </div>
        <Tippy content={"Click to create post"}>
          <div
            className={`fixed bottom-0 right-0 mx-[7rem] mb-[5rem] rounded-[50%] w-[4rem] h-[4rem] bg-[#fefae0] flex  items-center justify-center border-[0.1rem] border-[#081c15] text-[#081c15] hover:bg-[#081c15] hover:text-[#fefae0] duration-500 hover:border-[#fefae0]`}
          >
            <button
              onClick={() => setShowCreatePost(true)}
              className=" react-star"
            >
              <GoPlus className="text-[32px] " />
            </button>
          </div>
        </Tippy>
        {showCreatePost ? (
          <CreatePost onHide={() => setShowCreatePost(false)} />
        ) : null}
      </div>
    </section>
  );
};

export default Page;
