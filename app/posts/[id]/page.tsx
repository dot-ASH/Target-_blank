"use client";

import React, { useState, useEffect, useCallback, Fragment } from "react";

import { AiOutlineDelete, AiOutlineStar } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { TbExternalLink } from "react-icons/tb";
import { RiDeleteBin6Fill, RiPenNibFill } from "react-icons/ri";
import "tippy.js/dist/tippy.css";
import moment from "moment";
import "moment-timezone";
import { Player } from "video-react";
import "@/node_modules/video-react/styles/scss/video-react.scss";
import { useData } from "@/context/DataProvider";
import Link from "next/link";
import EditPost from "@/components/EditPost";
import { CldImage } from "next-cloudinary";
import api from "@/data/api";
import { useRouter } from "next/navigation";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

type ParamProps = {
  params: {
    id: string;
  };
};

const Page = ({ params }: ParamProps) => {
  const { id } = params;
  const router = useRouter();
  const { posts, user, users, comments, postReact, saved, refreshModule } =
    useData();

  const [post, setPost] = useState<Post>();
  const [comment, setComment] = useState<PostComment[]>([]);
  const [ifReacted, setIfReacted] = useState(false);
  const [reactedId, setReactId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  // const [timezone, setTimezone] = useState("");
  const [reactCount, setReactCount] = useState<number>();
  const [newComment, setNewComment] = useState("");
  const [isSaved, setSaved] = useState<boolean>(false);
  const [isAuthor, setAuthor] = useState<boolean>(false);
  const [showEditPost, setEditPost] = useState<boolean>(false);

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
    if (foundSaved) {
      setSaved(true);
      setSavedId(foundSaved.id);
    }
  }, [saved]);

  const fetchReact = useCallback(async () => {
    const foundSaved = postReact.find(
      (obj) => obj.postid === parseInt(id, 10) && obj.reactby === user?.id
    );
    if (foundSaved) {
      setIfReacted(true);
      setReactId(foundSaved.id);
    }
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
    return commentby?.full_name || commentby?.username;
  };

  const sendComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await api.post(
        `/comments`,
        JSON.stringify({
          postid: post?.id,
          commentby: user?.id,
          comment: newComment,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      await api.put(
        `/comments`,
        JSON.stringify({
          postid: post?.id,
          commentcount: (post?.commentcount as number) + 1,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setNewComment("");
      refreshModule();
    } catch (err) {
      if (!err) {
        console.log("No Server Response");
      } else {
        console.log("comment failed");
      }
      console.log(err);
    }
  };

  const deleteComment =
    (id: number) => async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      try {
        await api.delete(`/comments`, {
          data: {
            commentcount: (post?.commentcount as number) - 1,
            postid: post?.id,
            id: id,
          },
        });
        setIfReacted(false);
        setReactCount((reactCount as number) - 1);
        refreshModule();
      } catch (err) {
        if (!err) {
          console.log("No Server Response");
        } else {
          console.log("Error:", err);
        }
        console.log("Error:", err);
      }
    };

  const deletePost = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await api.delete(`/posts`, {
        data: {
          id: post?.id,
        },
      });
      refreshModule();
      router.push("/dashboard");
    } catch (err) {
      if (!err) {
        console.log("No Server Response");
      } else {
        console.log(".....");
      }
      console.log(err);
    }
  };

  const reactClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await api.post(
        `/reacts`,
        JSON.stringify({
          reactby: user?.id,
          postid: post?.id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      await api.put(
        `/reacts`,
        JSON.stringify({
          postid: post?.id,
          reactcount: (reactCount as number) + 1,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setIfReacted(true);
      setReactCount((reactCount as number) + 1);
      refreshModule();
    } catch (err) {
      if (!err) {
        console.log("No Server Response");
      } else {
        console.log("...");
      }
      console.log(err);
    }
  };

  const reactRemove = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await api.delete(`/reacts`, {
        data: {
          reactcount: (reactCount as number) - 1,
          postid: post?.id,
          id: reactedId,
        },
      });
      setIfReacted(false);
      setReactCount((reactCount as number) - 1);
    } catch (err) {
      if (!err) {
        console.log("No Server Response");
      } else {
        console.log("Error:", err);
      }
      console.log("Error:", err);
    }
  };

  const savePost = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await api.post(
        `/saved`,
        JSON.stringify({
          savedby: user?.id,
          postid: post?.id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSaved(true);
      refreshModule();
    } catch (err) {
      if (!err) {
        console.log("No Server Response");
      } else {
        console.log(".....");
      }
      console.log(err);
    }
  };

  const undoSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await api.delete(`/saved`, {
        data: {
          postid: post?.id,
          id: savedId,
        },
      });
      setSaved(false);
    } catch (err) {
      if (!err) {
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
        <div className=" flex flex-col container justify-between min-h-screen">
          <div className="content-head h-[85vh] mt-[6rem]">
            <div className="realative w-full h-full flex justify-center items-center bg-[#081c15] rounded-[5px]">
              <div className="absolute z-[1000]">
                <h1 className="text-[white]  text-center text-3xl top-[42%] m-[2rem] ">
                  {post && post.title}
                </h1>
                <p className="text-[white] text-center top-[42%] m-[2rem] ">
                  {post && post.description}
                </p>
              </div>

              {post && (
                <CldImage
                  alt=""
                  src={post.thumbimage}
                  width={1000}
                  height={1000}
                  className="relative h-full w-full object-cover opacity-[0.6] rounded-[5px]"
                />
              )}
            </div>
          </div>
          <div className="content-body flex flex-col w-full gap-[3rem] mt-[2rem] pt-[3rem] marker: border-t-[0.1rem] border-[#000000be]">
            <section
              id="my-post"
              className="relative flex w-full pb-[3rem] gap-[3rem] border-b-[0.1rem] border-[#000000be]"
            >
              <div className="content-body-info sticky top-16 flex flex-col max-h-[300px] gap-[1rem] border-r-[0.15rem] border-[#0000007e] rounded-[2px] pr-[2rem]">
                <div className=" flex text-left gap-[1.5rem] my-[1rem]">
                  <div className="flex items-center">
                    {user ? (
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
                      <Tippy content={<span>you need to be logged in</span>}>
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
                    <div> {post?.commentcount} </div>
                  </div>
                </div>
                <div className={`flex gap-[1rem]`}>
                  <div className="bg-[#00000010] p-[0.5rem] rounded-[15px] duration-[250ms] hover:bg-[#081c15] hover:text-[#fefae0] cursor-pointer whitespace-nowrap">
                    <Link href={`/categories/${post?.category}`}>
                      # {post?.category}
                    </Link>
                  </div>
                  <div className="bg-[#00000010] p-[0.5rem] rounded-[15px] duration-[250ms] hover:bg-[#081c15] hover:text-[#fefae0] cursor-pointer">
                    <Link href={`/type/${post?.type}`}>{post?.type}</Link>
                  </div>
                </div>
                <div className="flex gap-[1rem]">
                  <p className="italic underline whitespace-nowrap">
                    posted by:
                  </p>
                  <p className=" whitespace-nowrap">{post?.author}</p>
                </div>
                <div className="flex gap-[1rem]">
                  <p className="italic underline whitespace-nowrap">
                    Posted at:
                  </p>
                  <p className=" whitespace-nowrap">
                    {moment(post?.date).add(6, "hours").format("LLL")}
                  </p>
                </div>

                {user && (
                  <div className="w-[95%] flex justify-left items-center mt-[1rem] gap-[0.5rem]">
                    <button
                      className={
                        isAuthor
                          ? " w-full bg-[#081c15] p-[1rem] rounded text-[white]"
                          : "hide"
                      }
                      onClick={() => setEditPost(true)}
                    >
                      Edit Post
                    </button>
                    <button
                      className={
                        isAuthor
                          ? "bg-[#723d46] h-full p-[0.5rem] rounded-[5px]"
                          : "hide"
                      }
                      onClick={deletePost}
                    >
                      <RiDeleteBin6Fill className="text-[#fefae0] text-[22px] " />{" "}
                    </button>
                    <button
                      className={
                        isAuthor
                          ? "hide"
                          : "bg-[#081c15] text-[white] h-full p-[0.5rem] rounded-[5px] w-[90%]"
                      }
                      onClick={isSaved ? undoSave : savePost}
                    >
                      {isSaved ? "Saved!" : "Save The post"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex grow p-[3rem] bg-[#00000010] rounded-[10px] ">
                <div className="no-scroll-bar pt-[1rem]">
                  <p className="first-letter:text-[42px] text-justify leading-[2rem] pb-[2rem]">
                    {post?.content}
                  </p>

                  {post?.contentfilelink && (
                    <div>
                      {post.type == "image" ? (
                        <CldImage
                          src={post && post.contentfilelink}
                          className={
                            post && post.contentfilelink
                              ? `w-full object-cover`
                              : "hidden"
                          }
                          alt=""
                          width={500}
                          height={500}
                        />
                      ) : (
                        <div className={"w-full object-cover"}>
                          <Player
                            playsInline
                            fluid={false}
                            width={400}
                            height={400}
                            src={post?.contentfilelink}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={
                      post?.reference ? `flex gap-[1rem] mt-[1rem]` : `hidden`
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
                      {el.commentby === user?.id ? (
                        <div className="flex flex-col gap-[1rem] w-[100%] p-[1.5rem] py-[2rem] mb-[1rem] bg-[#00000010] rounded-[10px]">
                          <div className="comment-user font-bold text-[18px] flex gap-[0.5rem] items-center">
                            <p className="cursor-pointer">
                              {getCommentName(el.commentby)}
                            </p>
                            <div className=" text-[14px] text-[#474747] flex gap-[0.5rem] items-center bg-[#00000037] p-[0.2rem] rounded-[5px]">
                              <RiPenNibFill /> <p>author</p>
                            </div>
                            <p className="italic font-normal text-[14px] px-[1rem]">
                              {moment(el.date).add(6, "hours").fromNow()}
                            </p>
                            <button
                              data-index={el.id}
                              onClick={deleteComment(el.id as number)}
                              className={
                                el.commentby === user?.id
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
                              onClick={deleteComment(el.id as number)}
                              className={
                                el.commentby === user?.id
                                  ? "flex hover:scale-[1.1]"
                                  : "hide"
                              }
                            >
                              <AiOutlineDelete />
                            </button>
                            <p className="italic font-normal text-[14px] px-[1rem]">
                              {moment(el.date).add(6, "hours").fromNow()}
                            </p>
                            <p className="cursor-pointer">
                              {getCommentName(el.commentby)}
                            </p>
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
                      id="newComment"
                      type="text"
                      autoComplete="off"
                      onChange={(e) => setNewComment(e.target.value)}
                      value={newComment}
                      className="w-full p-[1rem] rounded-[5px] bg-[#00000010] "
                      required
                    />
                    <button
                      disabled={newComment ? false : true}
                      onClick={sendComment}
                      className="p-[1rem] rounded-[5px] bg-[#081c15] text-[#fefae0]"
                    >
                      comment
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center m-12">
                  You need to be logged in to comment
                </div>
              )}
            </section>
            {showEditPost && post ? (
              <EditPost post={post} onHide={() => setEditPost(false)} />
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
