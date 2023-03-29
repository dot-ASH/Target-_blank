import { Autoplay, Pagination, Navigation, EffectFade } from "swiper";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, useLocation } from "react-router-dom";
import api from "../../data/api";
import Footer from "./Footer";
import { AiOutlineDelete, AiOutlineStar } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { TbExternalLink } from "react-icons/tb";
import { RiDeleteBin6Fill, RiPenNibFill } from "react-icons/ri";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import moment from "moment";
import EditPost from "./EditPost";
import { Player } from "video-react";
import "../../node_modules/video-react/styles/scss/video-react.scss";

const ShowPost = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [comment, setComment] = useState([]);
  const [ifReacted, setIfReacted] = useState(false);
  const [reactCount, setReactCount] = useState(null);
  const [newComment, setNewComment] = useState([]);
  const [saved, setSaved] = useState(false);

  console.log(posts[0] && posts[0].type);

  const fetchPost = async () => {
    const response = await api.get(`post/${sessionStorage.getItem("postId")}`);
    setPosts(response.data);
    setReactCount(response.data[0].reactcount);
  };

  const fetchUser = async () => {
    const response = await api.get(`user/${sessionStorage.getItem("postBy")}`);
    setUser(response.data);
  };

  const fetchComment = async () => {
    const response = await api.get(
      `comments/${sessionStorage.getItem("postId")}`
    );
    setComment(response.data);
  };

  const fetchSave = async () => {
    const response = await api.get(
      `saved/${sessionStorage.getItem("postId")}/${localStorage.getItem("id")}`
    );
    console.log(response.data.length);
    if (response > 0) {
      setSaved(true);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchUser();
    fetchComment();
    fetchReact();
    fetchSave();
  }, []);

  const fetchReact = async () => {
    const response = await api.get(
      `reactby/${sessionStorage.getItem("postId")}/${localStorage.getItem(
        "id"
      )}`
    );
    if (response.data.length > 0) {
      setIfReacted(true);
    } else {
      setIfReacted(false);
    }
  };

  const isAuthor = (id1, id2) => {
    if (id1 == id2) {
      return true;
    } else return false;
  };

  const sendComment = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        `comments/${sessionStorage.getItem("postId")}`,
        JSON.stringify({
          commentby: localStorage.getItem("id"),
          comment: newComment,
          postby: user[0] && user[0].id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      window.location.href = "/show-post";
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log("comment failed");
      }
      console.log(err);
    }
  };

  const deleteComment = (id) => async (e) => {
    e.preventDefault();
    try {
      const response = await api.delete(
        `comments/${sessionStorage.getItem("postId")}`,
        { data: { id: id } }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      window.location.href = "/show-post";
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log("...");
      }
      console.log(err);
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    try {
      const response = await api.delete(
        `post/${sessionStorage.getItem("postId")}`
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      window.location.href = "/dashboard";
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log(".....");
      }
      console.log(err);
    }
  };

  const reactClick = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `reacts/${sessionStorage.getItem("postId")}`,
        JSON.stringify({
          reactby: localStorage.getItem("id"),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      setIfReacted(true);
      setReactCount(reactCount + 1);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log("...");
      }
      console.log(err);
    }
  };

  const reactRemove = async (e) => {
    e.preventDefault();
    try {
      const response = await api.delete(
        `reactby/${sessionStorage.getItem("postId")}/${localStorage.getItem(
          "id"
        )}`
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      setIfReacted(false);
      setReactCount(reactCount - 1);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log("....");
      }
      console.log(err);
    }
  };

  const createBtn = () => {
    document.body.style.overflow = "hidden";
    document.getElementById("edit-post").style.display = "block";
  };

  const savePost = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `saved/${sessionStorage.getItem("postId")}/${localStorage.getItem(
          "id"
        )}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSaved(true);
      console.log(response.data);
      console.log(JSON.stringify(response));
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log(".....");
      }
      console.log(err);
    }
  };

  const undoSave = async (e) => {
    e.preventDefault();
    try {
      const response = await api.delete(
        `saved/${sessionStorage.getItem("postId")}/${localStorage.getItem(
          "id"
        )}`
      );
      setSaved(false);
      console.log(response.data);
      console.log(JSON.stringify(response));
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log("....");
      }
      console.log(err);
    }
  };

  return (
    <>
      <section
        id="show-post"
        className="w-full section items-center justify-center"
      >
        <div className=" flex flex-col mt-[6rem] container justify-between min-h-screen">
          <div className="content-head h-[85vh]">
            <div className="swiper-slide-div w-full h-[90%] z-[10] py-[2rem] border-b-[0.1rem] border-[#081c15]">
              <Swiper
                spaceBetween={10}
                centeredSlides={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                speed={1600}
                modules={[Autoplay, Pagination, Navigation]}
                className="relative w-full h-full "
              >
                <SwiperSlide>
                  <div className="realative w-full h-full flex justify-center items-center bg-[#081c15] rounded-[5px]">
                    <div className="absolute z-[1000]">
                      <h1 className="text-[white]  text-center text-4xl top-[42%] m-[2rem] ">
                        {posts[0] && posts[0].title}
                      </h1>
                      <p className="text-[white] text-center top-[42%] m-[2rem] ">
                        {posts[0] && posts[0].description}
                      </p>
                    </div>

                    <img
                      src={posts[0] && posts[0].thumbimage}
                      className="absolute h-full w-full object-cover opacity-[0.6] rounded-[5px]"
                    ></img>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
          <div className="content-body flex flex-col w-full gap-[3rem]">
            <section
              id="my-post"
              className="flex w-full pb-[3rem] gap-[3rem] border-b-[0.1rem] border-[#000000be]"
            >
              <div className="content-body-info w-[25%] flex flex-col max-h-[300px] px-[1rem] gap-[1rem] border-r-[0.15rem]  border-[#0000007e] rounded-[2px]">
                <div className=" flex text-left gap-[1.5rem] my-[1rem]">
                  <div className="flex items-center">
                    {localStorage.getItem("id") ? (
                      <>
                        {isAuthor(
                          localStorage.getItem("id"),
                          posts[0] && posts[0].postby
                        ) ? (
                          <button disabled>
                            <AiOutlineStar className=" text-[36px]" />
                          </button>
                        ) : (
                          <Tippy
                            content={
                              ifReacted ? "You reacted" : "appreciate the post"
                            }
                          >
                            <button
                              value={"posts[0] && posts[0].reactcount"}
                              onClick={!ifReacted ? reactClick : reactRemove}
                            >
                              <AiOutlineStar
                                className={
                                  ifReacted
                                    ? "text-[36px]"
                                    : "react-star text-[36px]"
                                }
                              />
                            </button>
                          </Tippy>
                        )}
                      </>
                    ) : (
                      <Tippy content="you need to logged in">
                        <button disabled>
                          <AiOutlineStar className=" text-[36px]" />
                        </button>
                      </Tippy>
                    )}
                    &nbsp;
                    <div> {reactCount} </div>
                  </div>
                  <div className="flex items-center">
                    <Tippy content="comments">
                      <a href="#comments">
                        <BiComment className="text-[36px]" />
                      </a>
                    </Tippy>
                    &nbsp;
                    <div> {posts[0] && posts[0].commentcount} </div>
                  </div>
                </div>
                <div className={`flex gap-[1rem]`}>
                  <div className="bg-[#00000010] p-[0.5rem] rounded-[15px] duration-[250ms] hover:bg-[#081c15] hover:text-[#fefae0] cursor-pointer">
                    # {posts[0] && posts[0].category}
                  </div>
                  <div className="bg-[#00000010] p-[0.5rem] rounded-[15px] duration-[250ms] hover:bg-[#081c15] hover:text-[#fefae0] cursor-pointer">
                    {posts[0] && posts[0].type}
                  </div>
                </div>
                <div
                  className={
                    posts[0] && posts[0].author ? `flex gap-[1rem]` : `hidden`
                  }
                >
                  <p className="italic underline ">created by:</p>
                  {posts[0] && posts[0].author}
                </div>

                <div
                  className={
                    user[0] && user[0].full_name ? `flex gap-[1rem]` : `hidden`
                  }
                >
                  <p className="italic underline ">posted by:</p>
                  {user[0] && user[0].full_name}
                </div>
                {localStorage.getItem("id") &&<div
                  to={"/edit-post"}
                  className="w-[95%] flex justify-left items-center mt-[1rem] gap-[0.5rem]"
                >
                  <button
                    className={
                      isAuthor(
                        localStorage.getItem("id"),
                        posts[0] && posts[0].postby
                      )
                        ? " w-full bg-[#081c15] p-[1rem] rounded text-[white]"
                        : "hide"
                    }
                    onClick={() => createBtn()}
                  >
                    Edit Post
                  </button>
                  <button
                    className={
                      isAuthor(
                        localStorage.getItem("id"),
                        posts[0] && posts[0].postby
                      )
                        ? "bg-[#723d46] h-full p-[0.5rem] rounded-[5px]"
                        : "hide"
                    }
                    onClick={deletePost}
                  >
                    {" "}
                    <RiDeleteBin6Fill className="text-[#fefae0] text-[22px] " />{" "}
                  </button>
                  <button
                    className={
                      isAuthor(
                        localStorage.getItem("id"),
                        posts[0] && posts[0].postby
                      )
                        ? "hide"
                        : "bg-[#081c15] text-[white] h-full p-[0.5rem] rounded-[5px] w-[90%]"
                    }
                    onClick={saved ? undoSave : savePost}
                  >
                    {saved ? "Saved!" : "Save The post"}
                  </button>
                </div>}
              </div>

              <div className="w-[70%] p-[3rem] bg-[#00000010] rounded-[10px] ">
                <div className="no-scroll-bar max-h-[600px] overflow-y-scroll">
                  <p className="first-letter:text-[42px] text-justify leading-[2rem] pb-[2rem]">
                    {posts[0] && posts[0].content}
                  </p>
                  <div>
                    {posts[0] && posts[0].type == "image" ? (
                      <img
                        src={posts[0] && posts[0].contentfilelink}
                        className={
                          posts[0] && posts[0].contentfilelink
                            ? `w-full object-cover`
                            : "hidden"
                        }
                      />
                    ) : (
                      <Player
                        playsInline
                        fluid={false}
                        width="100%"
                        height={400}
                        src={posts[0] && posts[0].contentfilelink}
                        className={
                          posts[0] && posts[0].contentfilelink
                            ? `w-full object-cover`
                            : "hidden"
                        }
                      />
                    )}
                  </div>
                  <div
                    className={
                      posts[0] && posts[0].reference
                        ? `flex gap-[1rem] mt-[1rem]`
                        : `hidden`
                    }
                  >
                    <p className="">Learn more here</p>{" "}
                    <Link to={posts[0] && posts[0].reference}>
                      <TbExternalLink className="text-[20px]" />{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </section>
            <section id="comments">
              <h1 className=" uppercase font-bold text-center  my-[2rem]">
                ~ Comments ~
              </h1>

              {comment.length > 0 ? (
                comment.map((el) => {
                  return (
                    <>
                      {isAuthor(el.commentby, posts[0] && posts[0].postby) ? (
                        <div className="flex flex-col gap-[1rem] w-[100%] p-[1.5rem] py-[2rem] mb-[1rem] bg-[#00000010] rounded-[10px]">
                          <div className="comment-user font-bold text-[18px] flex gap-[0.5rem] items-center">
                            <p className="cursor-pointer">{el.commentbyname}</p>
                            <div className=" text-[14px] text-[#474747] flex gap-[0.5rem] items-center bg-[#00000037] p-[0.2rem] rounded-[5px]">
                              {" "}
                              <RiPenNibFill /> <p>author</p>
                            </div>
                            <p className="italic font-normal text-[14px] px-[1rem]">
                              {moment(el.date).startOf("hour").fromNow()}{" "}
                            </p>
                            <button
                              data-index={el.id}
                              onClick={deleteComment(el.id)}
                              className={
                                isAuthor(
                                  el.commentby,
                                  posts[0] && localStorage.getItem("id")
                                )
                                  ? "flex hover:scale-[1.1]"
                                  : "hide"
                              }
                            >
                              <AiOutlineDelete />
                            </button>
                          </div>

                          <p>
                            {"-->"} {el.comment}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-end items-end gap-[1rem] w-[100%] p-[1.5rem] py-[2rem] mb-[1rem] bg-[#00000010] rounded-[10px] text-right">
                          <div className="comment-user flex font-bold text-[18px] items-center">
                            <button
                              data-index={el.id}
                              onClick={deleteComment(el.id)}
                              className={
                                isAuthor(
                                  el.commentby,
                                  posts[0] && localStorage.getItem("id")
                                )
                                  ? "flex hover:scale-[1.1]"
                                  : "hide"
                              }
                            >
                              <AiOutlineDelete />
                            </button>
                            <p className="italic font-normal text-[14px] px-[1rem]">
                              {moment(el.date).startOf("hour").fromNow()}{" "}
                            </p>
                            <p className="cursor-pointer">
                              {" "}
                              {el.commentbyname}
                            </p>
                          </div>

                          <div className="flex">
                            {" "}
                            {el.comment} {"<--"}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })
              ) : (
                <div className="text-center m-[2rem]">No comments yet</div>
              )}
              {localStorage.getItem("id") ? (
                <div className="p-[1.5rem] py-[2rem] mb-[1rem] bg-[#00000010] rounded-[10px]">
                  <div className="comment-user font-bold text-[16px]"></div>
                  <form className="w-full flex gap-[1.5rem]">
                    <input
                      type="text"
                      autoComplete="off"
                      onChange={(e) => setNewComment(e.target.value)}
                      value={newComment}
                      className="w-full p-[1rem] rounded-[5px] bg-[#00000010] "
                      required
                    />
                    <button
                      onClick={sendComment}
                      className="p-[1rem] rounded-[5px] bg-[#081c15] text-[#fefae0]"
                    >
                      {" "}
                      comment{" "}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center">
                  You need to be logged in to comment
                </div>
              )}
            </section>
            <EditPost />
            <Footer></Footer>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShowPost;
