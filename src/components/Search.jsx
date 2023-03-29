import React, { useState, useRef, useEffect } from "react";
import api from "../../data/api";
import { BiSearchAlt as SearchIcon } from "react-icons/bi";
import { GiTireIronCross as CloseIcon } from "react-icons/gi";
import "../styles/main.scss";
import Footer from "./Footer";
import { Link } from "react-router-dom";
const Search = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [posts, setsPosts] = useState("");

  const fetchPost = async () => {
    const response = await api.get("posts");
    setsPosts(response.data);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = posts.filter((value) => {
      return value.title.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  function postToken(id, by) {
    sessionStorage.removeItem("postId");
    sessionStorage.removeItem("postBy");
    sessionStorage.setItem("postId", id);
    sessionStorage.setItem("postBy", by);
  }

  return (
    <>
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
                  onChange={handleFilter}
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
                {wordEntered && (
                  <h1>Showing results for "{wordEntered}" </h1>
                )}
              </div>
              {filteredData.length > 0 ? (
                <div className="dataResult">
                  {filteredData.slice(0, 5).map((value, key) => {
                    return (
                      <Link
                        to={"/show-post"}
                        className="dataItem"
                        onClick={() => postToken(value.id, value.postby)}
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
                    <p className="text-[32px] text-center font-bold my-[4rem]">No result Found</p>
                  )}
                </>
              )}
            </div>
          </div>
          <Footer></Footer>
        </div>
      </section>
    </>
  );
};

export default Search;
