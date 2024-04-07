"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import Link from "next/link";
import { useData } from "@/context/DataProvider";

const Mycomment = () => {
  const { user, comments } = useData();
  const [comment, setComments] = useState<PostComment[]>([]);
  const fetchComment = async () => {
    var result = comments.filter((obj) => obj.commentby === user?.id);
    setComments(result);
  };

  useEffect(() => {
    fetchComment();
  }, []);

  return (
    <section id="my-post">
      <div className="w-full">
        {comment.length > 0 ? (
          comment.map((el, index) => {
            return (
              <div key={index}>
                <div className="flex justify-between py-[1rem] w-full bg-[#00000010] my-[1rem] p-[0.5rem] px-[1.5rem] rounded-[2px]">
                  <div className="flex w-full">
                    <div className="flex flex-col justify-around w-full">
                      <div className="text-left py-[1rem]" key={el.id}>
                        <button>
                          <Link href={`/posts/${el.postid}`}>
                            <h1 className="font-bold">{el.comment}</h1>
                          </Link>
                        </button>
                      </div>
                      <div className="text-left">
                        <p className="italic">
                          - {moment(el.date).fromNow()}
                        </p>
                      </div>
                      <div className=" flex text-left py-[1rem] gap-[1.5rem]"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center">No Post yet</div>
        )}
      </div>
    </section>
  );
};

export default Mycomment;
