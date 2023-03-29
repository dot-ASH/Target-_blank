import React, { useState, useEffect, useRef } from "react";
import api from "../../data/api";
import moment from "moment";
import { AiOutlineStar } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { Link } from "react-router-dom";

const Mycomment = () => {
  const reactBtn = useRef();
  const [post, setPost] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const fetchPost = async (id) => {
    const response = await api.get(`posts`);
    setPosts(response.data);
  };

  const fetchComment = async () => {
    const response = await api.get(`comments`);
    var result = response.data.filter((obj) => {
      return obj.commentby == localStorage.getItem("id");
    });
    setComments(result);
    console.log(result);
  };

  useEffect(() => {
    fetchPost();
    fetchComment();
  }, []);

  function postToken(id, by) {
    sessionStorage.removeItem("postId");
    sessionStorage.removeItem("postBy");
    sessionStorage.setItem("postId", id);
    sessionStorage.setItem("postBy", by);
  }

  comments.sort((a, b) => b.id - a.id);

  return (
    <>
      <section id="my-post">
        <div className="w-full">
          {comments.length > 0 ? (
            comments.map((el, index) => {
              return (
                <>
                  <div>
                    <div className="flex justify-between py-[1rem] w-full bg-[#00000010] my-[1rem] p-[0.5rem] px-[1.5rem] rounded-[2px]">
                      <div className="flex w-full">
                        <div className="flex flex-col justify-around w-full">
                          <div className="text-left py-[1rem]" key={el.id}>
                            <button
                              onClick={() => postToken(el.postid, el.postby)}
                            >
                              <Link to="/show-post">
                                <h1 className="font-bold">{el.comment}</h1>{" "}
                              </Link>
                            </button>
                          </div>
                          <div className="text-left">
                            <p className="italic">
                              - {moment(el.date).format("MMM Do YY, hh:mm a")}
                            </p>
                          </div>
                          <div className=" flex text-left py-[1rem] gap-[1.5rem]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <div className="text-center">No Post yet</div>
          )}
        </div>
      </section>
    </>
  );
};

export default Mycomment;
