"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  Fragment,
} from "react";

// import api from "../data/api";
import { AiOutlineDelete, AiOutlineStar } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { TbExternalLink } from "react-icons/tb";
import { RiDeleteBin6Fill, RiPenNibFill } from "react-icons/ri";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import moment from "moment";
// import EditPost from "./EditPost";
import { Player } from "video-react";
import "@/node_modules/video-react/styles/scss/video-react.scss";
import { useData } from "@/context/DataProvider";
import Link from "next/link";

type ParamProps = {
  params: {
    id: string;
  };
};

const Page = ({ params }: ParamProps) => {
  const { id } = params;
  const { posts, user, users, comments, postReact, saved } = useData();

  const [post, setPost] = useState<Post>();
  const [comment, setComment] = useState<PostComment[]>([]);
  const [ifReacted, setIfReacted] = useState(false);
  const [reactCount, setReactCount] = useState<number>();
  const [newComment, setNewComment] = useState({
    comment: "",
    commentby: user?.id as number | 0,
    postid: parseInt(id, 10),
  });
  const [isSaved, setSaved] = useState<boolean>(false);
  const [isAuthor, setAuthor] = useState<boolean>(false);

  const fetchPost = useCallback(async () => {
    const foundPost = posts.find((obj) => obj.id === parseInt(id, 10));
    setPost(foundPost);
    setReactCount(foundPost?.reactcount);
    if (foundPost?.postby === user?.id) {
      setAuthor(true);
    } else {
      setAuthor(false);
    }
  }, [posts, user]);

  const fetchComment = useCallback(async () => {
    const foundComments = comments
      .filter((obj) => obj.postid === parseInt(id, 10))
      .sort((a, b) => (b?.id as number) - (a?.id as number));
    setComment(foundComments);
  }, [comments]);

  const fetchSave = useCallback(async () => {
    const foundSaved = saved.find((obj) => obj.postid === parseInt(id, 10));
    setSaved(foundSaved ? true : false);
  }, [saved]);

  const fetchReact = useCallback(async () => {
    const foundSaved = postReact.find((obj) => obj.postid === parseInt(id, 10));
    setIfReacted(foundSaved ? true : false);
  }, [postReact]);

  const dataFetchingFunctions = [
    fetchPost,
    fetchComment,
    fetchReact,
    fetchSave,
  ];

  useEffect(() => {
    dataFetchingFunctions.forEach((fetchData) => fetchData());
  }, dataFetchingFunctions);

  const getCommentName = (id: number): string | undefined => {
    const commentby = users.find((obj) => obj.id === id);
    return commentby?.full_name;
  };

  // const sendComment = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await api.post(
  //       `comments/${sessionStorage.getItem("postId")}`,
  //       JSON.stringify({
  //         commentby: localStorage.getItem("id"),
  //         comment: newComment,
  //         postby: user[0] && user[0].id,
  //       }),
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     console.log(response.data);
  //     console.log(JSON.stringify(response));
  //     window.location.href = "/show-post";
  //   } catch (err) {
  //     if (!err?.response) {
  //       console.log("No Server Response");
  //     } else {
  //       console.log("comment failed");
  //     }
  //     console.log(err);
  //   }
  // };

  // const deleteComment = (id) => async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.delete(
  //       `comments/${sessionStorage.getItem("postId")}`,
  //       { data: { id: id } }
  //     );
  //     console.log(response.data);
  //     console.log(JSON.stringify(response));
  //     window.location.href = "/show-post";
  //   } catch (err) {
  //     if (!err?.response) {
  //       console.log("No Server Response");
  //     } else {
  //       console.log("...");
  //     }
  //     console.log(err);
  //   }
  // };

  // const deletePost = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.delete(
  //       `post/${sessionStorage.getItem("postId")}`
  //     );
  //     console.log(response.data);
  //     console.log(JSON.stringify(response));
  //     window.location.href = "/dashboard";
  //   } catch (err) {
  //     if (!err?.response) {
  //       console.log("No Server Response");
  //     } else {
  //       console.log(".....");
  //     }
  //     console.log(err);
  //   }
  // };

  // const reactClick = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.post(
  //       `reacts/${sessionStorage.getItem("postId")}`,
  //       JSON.stringify({
  //         reactby: localStorage.getItem("id"),
  //       }),
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     console.log(response.data);
  //     console.log(JSON.stringify(response));
  //     setIfReacted(true);
  //     setReactCount(reactCount + 1);
  //   } catch (err) {
  //     if (!err?.response) {
  //       console.log("No Server Response");
  //     } else {
  //       console.log("...");
  //     }
  //     console.log(err);
  //   }
  // };

  // const reactRemove = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.delete(
  //       `reactby/${sessionStorage.getItem("postId")}/${localStorage.getItem(
  //         "id"
  //       )}`
  //     );
  //     console.log(response.data);
  //     console.log(JSON.stringify(response));
  //     setIfReacted(false);
  //     setReactCount(reactCount - 1);
  //   } catch (err) {
  //     if (!err?.response) {
  //       console.log("No Server Response");
  //     } else {
  //       console.log("....");
  //     }
  //     console.log(err);
  //   }
  // };

  // const createBtn = () => {
  //   document.body.style.overflow = "hidden";
  //   document.getElementById("edit-post").style.display = "block";
  // };

  // const savePost = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.post(
  //       `saved/${sessionStorage.getItem("postId")}/${localStorage.getItem(
  //         "id"
  //       )}`,
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     setSaved(true);
  //     console.log(response.data);
  //     console.log(JSON.stringify(response));
  //   } catch (err) {
  //     if (!err?.response) {
  //       console.log("No Server Response");
  //     } else {
  //       console.log(".....");
  //     }
  //     console.log(err);
  //   }
  // };

  // const undoSave = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.delete(
  //       `saved/${sessionStorage.getItem("postId")}/${localStorage.getItem(
  //         "id"
  //       )}`
  //     );
  //     setSaved(false);
  //     console.log(response.data);
  //     console.log(JSON.stringify(response));
  //   } catch (err) {
  //     if (!err?.response) {
  //       console.log("No Server Response");
  //     } else {
  //       console.log("....");
  //     }
  //     console.log(err);
  //   }
  // };

  return (
    <>
      <section
        id="show-post"
        className="w-full section items-center justify-center"
      >
        <div className=" flex flex-col container justify-between min-h-screen">
          <div className="content-head h-[85vh]">
            <div className="realative w-full h-full flex justify-center items-center bg-[#081c15] rounded-[5px]">
              <div className="absolute z-[1000]">
                <h1 className="text-[white]  text-center text-3xl top-[42%] m-[2rem] ">
                  {post && post.title}
                </h1>
                <p className="text-[white] text-center top-[42%] m-[2rem] ">
                  {post && post.description}
                </p>
              </div>

              <img
                src={post && post.thumbimage}
                className="relative h-full w-full object-cover opacity-[0.6] rounded-[5px]"
              ></img>
            </div>
          </div>
          <div className="content-body flex flex-col w-full gap-[3rem] mt-[2rem] pt-[3rem] marker: border-t-[0.1rem] border-[#000000be]">
            <section
              id="my-post"
              className="flex w-full pb-[3rem] gap-[3rem] border-b-[0.1rem] border-[#000000be]"
            >
              <div className="content-body-info flex flex-col max-h-[300px] gap-[1rem] border-r-[0.15rem] border-[#0000007e] rounded-[2px] pr-[2rem]">
                <div className=" flex text-left gap-[1.5rem] my-[1rem]">
                  <div className="flex items-center">
                    {localStorage.getItem("id") ? (
                      <>
                        {isAuthor ? (
                          <button disabled>
                            <AiOutlineStar className="text-[36px] whitespace-nowrap" />
                          </button>
                        ) : (
                          <Tippy
                            content={
                              ifReacted ? "You reacted" : "appreciate the post"
                            }
                          >
                            <button
                              value={post && post.reactcount}
                              // onClick={!ifReacted ? reactClick : reactRemove}
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
                      <Tippy content="you need to be logged in">
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
                    <div> {post && post.commentcount} </div>
                  </div>
                </div>
                <div className={`flex gap-[1rem]`}>
                  <div className="bg-[#00000010] p-[0.5rem] rounded-[15px] duration-[250ms] hover:bg-[#081c15] hover:text-[#fefae0] cursor-pointer whitespace-nowrap">
                    # {post && post.category}
                  </div>
                  <div className="bg-[#00000010] p-[0.5rem] rounded-[15px] duration-[250ms] hover:bg-[#081c15] hover:text-[#fefae0] cursor-pointer">
                    {post && post.type}
                  </div>
                </div>
                <div
                  className={
                    post && post.author ? `flex gap-[1rem]` : `hidden`
                  }
                >
                  <p className="italic underline whitespace-nowrap">posted by:</p>
                  <p className=" whitespace-nowrap">{post && post.author}</p>
                </div>

                {user && (
                  <div className="w-[95%] flex justify-left items-center mt-[1rem] gap-[0.5rem]">
                    <button
                      className={
                        isAuthor
                          ? " w-full bg-[#081c15] p-[1rem] rounded text-[white]"
                          : "hide"
                      }
                      // onClick={() => createBtn()}
                    >
                      Edit Post
                    </button>
                    <button
                      className={
                        isAuthor
                          ? "bg-[#723d46] h-full p-[0.5rem] rounded-[5px]"
                          : "hide"
                      }
                      // onClick={deletePost}
                    >
                      <RiDeleteBin6Fill className="text-[#fefae0] text-[22px] " />{" "}
                    </button>
                    <button
                      className={
                        isAuthor
                          ? "hide"
                          : "bg-[#081c15] text-[white] h-full p-[0.5rem] rounded-[5px] w-[90%]"
                      }
                      // onClick={saved ? undoSave : savePost}
                    >
                      {isSaved ? "Saved!" : "Save The post"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex grow p-[3rem] bg-[#00000010] rounded-[10px] ">
                <div className="no-scroll-bar max-h-[600px] overflow-y-scroll pt-[1rem]">
                  <p className="first-letter:text-[42px] text-justify leading-[2rem] pb-[2rem]">
                    {post && post.content}
                  </p>
                  <div>
                    {post && post.type == "image" ? (
                      <img
                        src={post && post.contentfilelink}
                        className={
                          post && post.contentfilelink
                            ? `w-full object-cover`
                            : "hidden"
                        }
                      />
                    ) : (
                      <Player
                        playsInline
                        fluid={false}
                        width={400}
                        height={400}
                        src={post && post.contentfilelink}
                        // style={
                        //   post && post.contentfilelink
                        //     ? `w-full object-cover`
                        //     : "hidden"
                        // }
                      />
                    )}
                  </div>
                  <div
                    className={
                      post && post.reference
                        ? `flex gap-[1rem] mt-[1rem]`
                        : `hidden`
                    }
                  >
                    <p className="">Learn more here</p>
                    <Link href={(post && post.reference) || ""}>
                      <TbExternalLink className="text-[20px]" />
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
                comment.map((el, index) => {
                  return (
                    <Fragment key={index}>
                      {isAuthor ? (
                        <div className="flex flex-col gap-[1rem] w-[100%] p-[1.5rem] py-[2rem] mb-[1rem] bg-[#00000010] rounded-[10px]">
                          <div className="comment-user font-bold text-[18px] flex gap-[0.5rem] items-center">
                            <p className="cursor-pointer">
                              {getCommentName(el.commentby)}
                            </p>
                            <div className=" text-[14px] text-[#474747] flex gap-[0.5rem] items-center bg-[#00000037] p-[0.2rem] rounded-[5px]">
                              <RiPenNibFill /> <p>author</p>
                            </div>
                            <p className="italic font-normal text-[14px] px-[1rem]">
                              {moment(el.date).startOf("hour").fromNow()}{" "}
                            </p>
                            <button
                              data-index={el.id}
                              // onClick={deleteComment(el.id)}
                              className={
                                isAuthor ? "flex hover:scale-[1.1]" : "hide"
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
                              // data-index={el.id}
                              // onClick={deleteComment(el.id)}
                              className={
                                isAuthor ? "flex hover:scale-[1.1]" : "hide"
                              }
                            >
                              <AiOutlineDelete />
                            </button>
                            <p className="italic font-normal text-[14px] px-[1rem]">
                              {moment(el.date).startOf("hour").fromNow()}
                            </p>
                            <p className="cursor-pointer">{el.commentby}</p>
                          </div>

                          <div className="flex">
                            {el.comment} {"<--"}
                          </div>
                        </div>
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <div className="text-center m-[2rem]">No comments yet</div>
              )}
              {user ? (
                <div className="p-[1.5rem] py-[2rem] mb-[1rem] bg-[#00000010] rounded-[10px]">
                  <div className="comment-user font-bold text-[16px]"></div>
                  <form className="w-full flex gap-[1.5rem]">
                    <input
                      type="text"
                      autoComplete="off"
                      onChange={(e) =>
                        setNewComment((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      value={newComment?.comment}
                      className="w-full p-[1rem] rounded-[5px] bg-[#00000010] "
                      required
                    />
                    <button
                      // onClick={sendComment}
                      className="p-[1rem] rounded-[5px] bg-[#081c15] text-[#fefae0]"
                    >
                      comment
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center">
                  You need to be logged in to comment
                </div>
              )}
            </section>
            {/* <EditPost />
            <Footer></Footer> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
