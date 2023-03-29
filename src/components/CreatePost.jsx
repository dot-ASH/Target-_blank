import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { GiTireIronCross } from "react-icons/gi";
import api from "../../data/api";

const MIN_TEXTAREA_HEIGHT = 45;

const CreatePost = () => {
  const destextareaRef = useRef(null);
  const contextareaRef = useRef(null);
  const [desValue, setDesValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [referenceValue, setReferenceValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [authorValue, setAuthorValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [catValue, setCatValue] = useState("");
  const [thumb, setThumb] = useState("");
  const [thumbLink, setThumbLink] = useState("");
  const [validThumbLink, setValidThumbLink] = useState(false);
  const [contentFile, setContentFile] = useState("");
  const [contentFileLink, setContentFileLink] = useState("");
  const [validFileLink, setValidFileLink] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDesChange = (event) => setDesValue(event.target.value);
  const onContentChange = (event) => setContentValue(event.target.value);
  const createBtn = () => {
    document.body.style.overflow = "scroll";
    document.getElementById("create-post").style.display = "none";
  };

  useLayoutEffect(() => {
    destextareaRef.current.style.height = "inherit";

    destextareaRef.current.style.height = `${Math.max(
      destextareaRef.current.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [destextareaRef]);

  useLayoutEffect(() => {
    contextareaRef.current.style.height = "inherit";

    contextareaRef.current.style.height = `${Math.max(
      contextareaRef.current.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [contentValue]);

  const submitImage = (e) => {
    e.preventDefault();
    console.log(thumb);
    const data = new FormData();
    data.append("file", thumb);
    data.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

    fetch(import.meta.env.VITE_UPLOAD_IMAGE, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setThumbLink(data.url);
        setValidThumbLink(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitFile = (e) => {
    if (typeValue === "" || typeValue == "image") {
      e.preventDefault();
      const data = new FormData();
      data.append("file", contentFile);
      data.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
      data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

      fetch(import.meta.env.VITE_UPLOAD_IMAGE, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setContentFileLink(data.url);
          setValidFileLink(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      e.preventDefault();
      const data = new FormData();
      data.append("file", contentFile);
      data.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
      data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

      fetch(import.meta.env.VITE_UPLOAD_VIDEO, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setContentFileLink(data.url);
          setValidFileLink(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var postBy = localStorage.getItem("id");
    console.log(thumbLink);
    console.log(contentFileLink || null);

    try {
      const response = await api.post(
        "posts",
        JSON.stringify({
          title: titleValue,
          postby: postBy,
          description: desValue,
          author: authorValue,
          type: typeValue || "image",
          category: catValue || "sports",
          thumbimage: thumbLink,
          content: contentValue,
          reference: referenceValue,
          contentfilelink: contentFileLink || null,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      setSuccess(true);
      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section
      id="create-post"
      className="hidden create-post show-shadow z-[10000] fixed w-[80vw] h-[80vh] bg-[#fefae0] border-[0.1rem] border-[#081c15] rounded-[20px] overflow-y-scroll duration-300 top-[10%] mx-[auto] left-[10%]"
    >
      {success ? (
        <section id="success-container w-full section  items-center justify-center">
          <div className=" flex flex-col section items-center h-full gap-[2rem] pt-[9rem]">
            <div className="items-center container justify-center w-full flex flex-col rounded-[5px] py-[5rem]">
              <div className="w-full items-center border-[0.1rem] border-[black] p-[6rem] rounded-[5px]">
                <h1 className="text-center">Your post has been posted</h1>
              </div>
              <Footer />
            </div>
          </div>
        </section>
      ) : (
        <div className="flex flex-col  m-[3rem]">
          <button onClick={createBtn}>
            <GiTireIronCross className=" font-bold text-[20px]" />{" "}
          </button>
          <div>
            <h1 className=" uppercase font-bold text-center my-[1rem]">
              ~ Create A post ~
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

              <div className="w-full flex justify-between items-center">
                <p className="w-max"> The content contains</p>
                <div className="w-[80%] flex gap-[2rem] justify-start">
                  <label className="flex items-center gap-[2rem] justify-between">
                    <select
                      value={typeValue}
                      onChange={(e) => setTypeValue(e.target.value)}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-[2rem] justify-between">
                    <p className="w-max">on</p>{" "}
                    <select
                      value={catValue}
                      onChange={(e) => setCatValue(e.target.value)}
                    >
                      <option value="sports">Sports</option>
                      <option value="politics">Politics</option>
                      <option value="fashion">Fashion</option>
                      <option value="tech">Technology</option>
                      <option value="music-film">Music-film</option>
                    </select>
                  </label>
                </div>
              </div>

              <label
                htmlFor="description"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Short Description</p>{" "}
                <textarea
                  type="text"
                  id="description"
                  className="w-[80%]  "
                  onChange={onDesChange}
                  ref={destextareaRef}
                  style={{
                    minHeight: MIN_TEXTAREA_HEIGHT,
                    resize: "none",
                  }}
                  value={desValue}
                  required
                />
              </label>
              <label
                htmlFor="description"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Content</p>{" "}
                <textarea
                  type="text"
                  id="content"
                  className="w-[80%] overflow-hidden p-[1rem]"
                  onChange={onContentChange}
                  ref={contextareaRef}
                  style={{
                    minHeight: MIN_TEXTAREA_HEIGHT,
                    resize: "none",
                  }}
                  value={contentValue}
                  required
                />
              </label>
              <label
                htmlFor="reference"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Reference</p>{" "}
                <textarea
                  type="text"
                  id="content"
                  className="w-[80%] overflow-hidden p-[1rem]"
                  style={{ height: "3rem" }}
                  onChange={(e) => setReferenceValue(e.target.value)}
                  value={referenceValue}
                />
              </label>

              <label
                htmlFor="thumb"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">Thumbnail</p>{" "}
                <div className="w-[80%] flex justify-between items-center">
                  <input
                    type="file"
                    id="thumb"
                    onChange={(e) => setThumb(e.target.files[0])}
                    aria-describedby="filenote"
                    className="w-[80%] bg-[#fefae0] p-[0.5rem] rounded-[5px]"
                  />
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validThumbLink ? "text-[#262520]" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validThumbLink ? "hide" : "text-[#30302c]"}
                  />
                  <button onClick={submitImage}>add image</button>
                </div>
              </label>

              <label
                htmlFor="contentFile"
                className="flex w-full items-center gap-[2rem] justify-between"
              >
                <p className="w-max">
                  Upload {typeValue ? typeValue : "image"}
                </p>{" "}
                <div className="w-[80%] flex justify-between items-center">
                  <input
                    type="file"
                    id="contentFile"
                    onChange={(e) => setContentFile(e.target.files[0])}
                    aria-describedby="filenote"
                    className="w-[80%] bg-[#fefae0] p-[0.5rem] rounded-[5px]"
                  />
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validThumbLink ? "text-[#262520]" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validThumbLink ? "hide" : "text-[#30302c]"}
                  />
                  <button onClick={submitFile}>add file</button>
                </div>
              </label>

              <div className="w-full flex justify-end p-[1rem]">
                {" "}
                <div className="flex bg-[#081c15]  text-[#fefae0] rounded-[3px]">
                  <span className="spooky-button">
                    <button onClick={handleSubmit}> publish</button>
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

export default CreatePost;
