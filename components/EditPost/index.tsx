"use client";

import React, { useState, useEffect } from "react";
import { GiTireIronCross } from "react-icons/gi";
import api from "@/data/api";
import { useData } from "@/context/DataProvider";

type ParamProps = {
  post: Post;
  onHide: () => void;
};
const EditPost = ({ post, onHide }: ParamProps) => {
  const { refreshModule } = useData();
  const [desValue, setDesValue] = useState<string>("");
  const [contentValue, setContentValue] = useState<string>("");
  const [referenceValue, setReferenceValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [authorValue, setAuthorValue] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchPost = () => {
    setTitleValue(post.title);
    setAuthorValue(post.author);
    setDesValue(post.description);
    setContentValue(post.content);
    setReferenceValue(post.reference);
  };

  const onDesChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setDesValue(event.target.value);
  const onContentChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setContentValue(event.target.value);

  useEffect(() => {
    fetchPost();
  }, [post]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await api.put(
        `/posts`,
        JSON.stringify({
          title: titleValue,
          description: desValue,
          author: authorValue,
          content: contentValue,
          reference: referenceValue,
          id: post.id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSuccess(true);
      refreshModule();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section
      id="edit-post"
      className="create-post show-shadow z-[10000] fixed w-[80vw] h-[80vh] bg-[#fefae0] border-[0.1rem] border-[#081c15] rounded-[20px] overflow-y-scroll duration-300 top-[10%] left-[10%]"
    >
      {success ? (
        <div id="success-container w-full section  items-center justify-center">
          <button onClick={onHide} className="m-16">
            <GiTireIronCross className=" font-bold text-[20px]" />
          </button>
          <div className=" flex flex-col section items-center h-full gap-[2rem] pt-[2rem]">
            <div className="items-center container justify-center w-full flex flex-col rounded-[5px] py-[5rem]">
              <div className="w-full items-center border-[0.1rem] border-[black] p-[6rem] rounded-[5px]">
                <h1 className="text-center">Your post has been edited</h1>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-[80%] h-[80%] m-[3rem]">
          <button onClick={onHide}>
            <GiTireIronCross className=" font-bold text-[20px]" />
          </button>
          <div>
            <h1 className=" uppercase font-bold text-center my-[1rem]">
              ~ Edit the post ~
            </h1>
          </div>
          <div className="w-full p-[3rem]">
            <form className="create-post-form py-[1rem] w-full flex flex-col gap-[2rem] justify-between">
              <label
                htmlFor="title"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Title of the content</p>{" "}
                <input
                  type="text"
                  id="title"
                  className="w-[80%]"
                  onChange={(e) => setTitleValue(e.target.value)}
                  value={titleValue}
                  required
                />
              </label>
              <label
                htmlFor="createdby"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Created By</p>{" "}
                <input
                  type="text"
                  id="createdby"
                  className="w-[80%] "
                  onChange={(e) => setAuthorValue(e.target.value)}
                  value={authorValue}
                />
              </label>

              <label
                htmlFor="description"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Short Description</p>
                <textarea
                  id="description"
                  className="w-[80%]  "
                  onChange={onDesChange}
                  style={{ height: "3rem" }}
                  value={desValue}
                  required
                />
              </label>
              <label
                htmlFor="content"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Content</p>
                <textarea
                  id="content"
                  className="w-[80%]"
                  onChange={onContentChange}
                  style={{ height: "3rem" }}
                  value={contentValue}
                  required
                />
              </label>
              <label
                htmlFor="reference"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Reference</p>
                <textarea
                  id="reference"
                  className="w-[80%] overflow-hidden p-[1rem]"
                  style={{ height: "3rem" }}
                  onChange={(e) => setReferenceValue(e.target.value)}
                  value={referenceValue}
                />
              </label>

              <div className="w-full flex justify-end p-[1rem]">
                <div className="flex bg-[#081c15]  text-[#fefae0] rounded-[3px]">
                  <span className="spooky-button">
                    <button onClick={handleSubmit}> submit</button>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditPost;
