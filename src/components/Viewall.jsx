import React, { useState, useRef, useEffect } from "react";
import { AiOutlineStar } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { Link } from "react-router-dom";
import api from "../../data/api";
import Footer from "./Footer";
import moment from "moment";

const Viewall = () => {
  const [posts, setPosts] = useState([]);
  const [recentSelected, setRecentSelected] = useState(true);
  const fetchPost = async () => {
    const response = await api.get("posts");
    setPosts(response.data);
  };
  useEffect(() => {
    fetchPost();
  }, []);

  function postToken(id, by) {
    sessionStorage.removeItem("postId");
    sessionStorage.removeItem("postBy");
    sessionStorage.setItem("postId", id);
    sessionStorage.setItem("postBy", by);
  }

  const recentBtn = () => {
    setRecentSelected(true);
  };

  const popularBtn = () => {
    setRecentSelected(false);
  };

  if (recentSelected) {
    posts.sort((b, a) => a.id - b.id);
  } else {
    posts.sort((b, a) => a.reactcount - b.reactcount);
  }

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
              Sort by:{" "}
              <button
                onClick={recentBtn}
                className={recentSelected ? "underline" : "hover:underline"}
              >
                {" "}
                recent
              </button>{" "}
              /{" "}
              <button
                onClick={popularBtn}
                className={!recentSelected ? "underline" : "hover:underline"}
              >
                {" "}
                popular{" "}
              </button>
            </div>
            <div className="w-full my-[2rem] mt-[1rem]">
              {posts.map((el, index) => {
                return (
                  <>
                    <div>
                      <div className="flex justify-between py-[1rem] w-full bg-[#00000010] my-[1rem] p-[0.5rem] px-[1.5rem] rounded-[2px]">
                        <div className="flex w-full">
                          <div className="flex flex-col justify-around w-full">
                            <div className="text-left py-[1rem]" key={el.id}>
                              <button
                                onClick={() => postToken(el.id, el.postby)}
                              >
                                <Link to="/show-post">
                                  <h1 className="font-bold text-left">
                                    {el.title}
                                  </h1>{" "}
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
                                </button>{" "}
                                &nbsp;
                                <div> {el.reactcount}</div>
                              </div>
                              <div className="flex">
                                <button>
                                  <BiComment className="text-[22px]" />
                                </button>{" "}
                                &nbsp;
                                <div> {el.commentcount}</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <img
                              src={el.thumbimage}
                              className="h-[300px] w-[400px] object-cover rounded-[5px]"
                            ></img>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <Footer></Footer>
        </div>
      </section>
    </>
  );
};

export default Viewall;
