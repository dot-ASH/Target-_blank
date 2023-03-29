import React, { useState, useEffect, useRef } from "react";
import api from "../../data/api";
import moment from "moment";
import { AiOutlineStar } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { Link } from "react-router-dom";

const Mysave = () => {
  const [posts, setPosts] = useState([]);
  const fetchPost = async () => {
    const response = await api.get(`saved`);
    setPosts(response.data);

    var result = response.data.filter((obj) => {
      return obj.savedby == localStorage.getItem("id");
    });

    setPosts(result);
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

  return (
    <>
      <section id="my-save">
      <div className="w-full">
          {posts.length > 0 ? (
            posts.map((el, index) => {
              return (
                <>
                  <div>
                    <div className="flex justify-between py-[1rem] w-full bg-[#00000010] my-[1rem] p-[0.5rem] px-[1.5rem] rounded-[2px]">
                      <div className="flex w-full">
                        <div className="flex flex-col justify-around w-full">
                          <div className="text-left py-[1rem]" key={el.id}>
                            <button onClick={() => postToken(el.id, el.postby)}>
                              <Link to="/show-post">
                                <h1 className="font-bold">{el.title}</h1>{" "}
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
            })
          ) : (
            <div className="text-center">No saved post yet!</div>
          )}
        </div>
      </section>
    </>
  );
};

export default Mysave;
