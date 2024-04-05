"use client";

import React, { useState, useEffect } from "react";
import { BiSearchAlt as SearchIcon } from "react-icons/bi";
import { GiTireIronCross as CloseIcon } from "react-icons/gi";
import "@/styles/main.scss";
import Link from "next/link";
import { useData } from "@/context/DataProvider";
const Page = () => {
  const { posts } = useData();
  const [filteredData, setFilteredData] = useState<Post[]>([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = () => {
    const newFilter = posts.filter((value) => {
      return value.title.toLowerCase().includes(wordEntered.toLowerCase());
    });

    if (wordEntered === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  useEffect(() => {
    handleFilter();
  }, [wordEntered]);

  return (
    <section
      id="view-all"
      className="w-full section items-center justify-center "
    >
      <div className=" flex flex-col mt-[6rem] container justify-between min-h-screen">
        <div className="content-body flex flex-col items-center justify-center">
          <div className="search my-[3rem] w-[60%]">
            <div className="searchInputs flex items-center ">
              <input
                type="text"
                value={wordEntered}
                onChange={(e) => setWordEntered(e.target.value)}
                className="flex"
              />
              <div className="searchIcon ml-[-2rem]">
                {filteredData.length === 0 || wordEntered.length < 1 ? (
                  <SearchIcon />
                ) : (
                  <CloseIcon
                    id="clearBtn"
                    onClick={clearInput}
                    className="text-[14px] cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="my-[1rem] text-center w-full">
              {wordEntered && <h1>Showing results for "{wordEntered}" </h1>}
            </div>
            {filteredData.length > 0 ? (
              <div className="dataResult">
                {filteredData.slice(0, 5).map((value, key) => {
                  return (
                    <Link
                      href={`/posts/${value.id}`}
                      className="dataItem"
                      key={key}
                    >
                      <p>{value.title} </p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <>
                {wordEntered.length < 1 ? (
                  <div className="my-[1rem] text-left w-full">
                    <h1>Start Typing Something....</h1>
                  </div>
                ) : (
                  <p className="text-[32px] text-center font-bold my-[4rem]">
                    No result Found
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
