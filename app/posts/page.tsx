"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineStar } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import Link from "next/link";
import moment from "moment";
import { useData } from "@/context/DataProvider";
import { CldImage } from "next-cloudinary";

const Page = () => {
  const { posts } = useData();
  const [recentSelected, setRecentSelected] = useState(true);
  const [allPost, setAllPosts] = useState<Post[]>(posts);

  const recentBtn = () => {
    setRecentSelected(true);
  };

  const popularBtn = () => {
    setRecentSelected(false);
  };

  useEffect(() => {
    if (recentSelected) {
      const sortedPosts = [...posts].sort((a, b) => b.id - a.id);
      setAllPosts(sortedPosts);
    } else {
      const sortedPosts = [...posts].sort(
        (a, b) => b.reactcount - a.reactcount
      );
      setAllPosts(sortedPosts);
    }
  }, [recentSelected, posts]);

  return (
    <>
      <section
        id="view-all"
        className="w-full section items-center justify-center"
      >
        <div className=" flex flex-col mt-[6rem] container justify-between min-h-screen">
          <div className="content-body flex flex-col items-center justify-center">
            <h1 className=" uppercase font-bold my-[2rem] mt-[3rem]">
              ~ All posts ~
            </h1>
            <div className="flex gap-[0.5rem]">
              Sort by:
              <button
                onClick={recentBtn}
                className={recentSelected ? "underline" : "hover:underline"}
              >
                recent
              </button>
              /
              <button
                onClick={popularBtn}
                className={!recentSelected ? "underline" : "hover:underline"}
              >
                popular
              </button>
            </div>
            <div className="w-full my-[2rem] mt-[1rem]">
              {allPost.map((el, index) => {
                return (
                  <div key={index}>
                    <div className="flex justify-between py-[1rem] w-full bg-[#00000010] my-[1rem] p-[0.5rem] px-[1.5rem] rounded-[2px]">
                      <div className="flex w-full">
                        <div className="flex flex-col justify-around w-full">
                          <div className="text-left py-[1rem]" key={el.id}>
                            <button>
                              <Link href={`/posts/${el.id}`}>
                                <h1 className="font-bold text-left">
                                  {el.title}
                                </h1>
                              </Link>
                            </button>
                          </div>
                          <div className="text-left">
                            <p className="italic">
                              - {moment(el.date).format("MMM Do YY")}
                            </p>
                          </div>
                          <div className="text-left py-[1rem]">
                            <p className="">{el.description}</p>
                          </div>
                          <div className=" flex text-left py-[1rem] gap-[1.5rem]">
                            <div className="flex">
                              <button>
                                <AiOutlineStar className="text-[22px]" />
                              </button>
                              &nbsp;
                              <div> {el.reactcount}</div>
                            </div>
                            <div className="flex">
                              <button>
                                <BiComment className="text-[22px]" />
                              </button>
                              &nbsp;
                              <div> {el.commentcount}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <CldImage
                            alt=""
                            width={400}
                            height={400}
                            src={el.thumbimage}
                            className="h-[300px] w-[400px] object-cover rounded-[5px]"
                          ></CldImage>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
