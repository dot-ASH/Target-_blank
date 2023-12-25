import { Autoplay, Pagination, Navigation, EffectFade } from "swiper";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import soldier from "/soldier.jpeg";
import pillow from "/pillow.jpeg";
import api from "../../data/api";
import zoom from "/zoom.jpeg";
import film from "/film.jpg";
import moment from "moment";
import { GiDandelionFlower } from "react-icons/gi";
import Footer from "./Footer";
import "swiper/css";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Tippy from "@tippyjs/react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [postCount, setCount] = useState(15);
  const [height, setHeight] = useState("5rem");
  const [activeSection, setActiveSection] = useState("");

  const fetchPost = async () => {
    const response = await api.get("posts");
    setPosts(response.data);
    setAllPosts(response.data);
  };

  const fetchUser = async () => {
    const response = await api.get(`user/${localStorage.getItem("id")}`);
    setUser(response.data);
  };

  const fetchCat = async () => {
    const response = await api.get("categories");
    
    console.log(response);
    setCategories(response.data);
  };

  const handleScroll = (event) => {
    if (window.scrollY > 10) {
      setHeight("4rem");
    } else setHeight("5rem");
  };

  useEffect(() => {
    console.log("heii", import.meta.env.VITE_API);
    fetchPost();
    fetchCat();
    fetchUser();
    window.addEventListener("scroll", handleScroll);
    console.log(1935 + document.getElementById("posts").scrollHeight - 1500);
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 0 && window.scrollY < 617) {
        setActiveSection("home");
      } else if (window.scrollY > 617 && window.scrollY < 1250) {
        setActiveSection("info");
      } else if (window.scrollY > 1250 && window.scrollY < 1935) {
        setActiveSection("feature");
      } else if (
        window.scrollY > 1935 &&
        window.scrollY <
          1935 + document.getElementById("posts").scrollHeight - 1000
      ) {
        setActiveSection("post");
      } else {
        setActiveSection("support");
      }
    });
  }, []);

  categories.sort((a, b) => a.id - parseFloat(b.id));

  posts.sort((b, a) => a.reactcount - b.reactcount);
  // allPosts.sort((b, a) => a.id - b.id);

  function postToken(id, by) {
    sessionStorage.removeItem("postId");
    sessionStorage.removeItem("postBy");
    sessionStorage.setItem("postId", id);
    sessionStorage.setItem("postBy", by);
  }

  function typeToken(t) {
    sessionStorage.removeItem("type");
    sessionStorage.setItem("type", t);
  }

  const subsCribe = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `newsletter/${localStorage.getItem("id")}`,
        JSON.stringify({}),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      window.location.href = "/";
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("...");
      }
      console.log(err);
    }
  };

  return (
    <>
      <div className="homepage-container flex flex-col w-full h-full justify-center items-center">
        <section id="home" className="container section mt-[6rem] h-[85vh]">
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
                <div className="realative w-full h-full">
                  <h1 className="absolute text-[white] text-4xl top-[42%] ml-[2rem]">
                    Target Blank Magazine
                  </h1>
                  <div className=" absolute text-[white] top-[55%] ml-[2rem]">
                    <div className="flex flex-row gap-[0.3rem] items-center">
                      The survival of{" "}
                      <p className="genre-active"> technology, </p>
                      <p> politics,</p>
                      <p>music-film </p> and <p>fashion</p> is in the hand of
                      writting!
                    </div>
                  </div>
                  <img src={zoom} className="slide-img"></img>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="realative w-full h-full">
                  <h1 className="absolute text-[white] text-4xl top-[42%] ml-[2rem]">
                    Target Blank Magazine
                  </h1>
                  <div className=" absolute text-[white] top-[55%] ml-[2rem]">
                    <div className="flex flex-row gap-[0.3rem] items-center">
                      The survival of <p> technology, </p>
                      <p className="genre-active"> politics,</p>
                      <p>music-film </p> and <p>fashion</p> is in the hand of
                      writting!
                    </div>
                  </div>
                  <img src={soldier} className="slide-img"></img>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="realative w-full h-full">
                  <h1 className="absolute text-[white] text-4xl top-[42%] ml-[2rem]">
                    Target Blank Magazine
                  </h1>
                  <div className=" absolute text-[white] top-[55%] ml-[2rem]">
                    <div className="flex flex-row gap-[0.3rem] items-center">
                      The survival of <p> technology, </p>
                      <p> politics,</p>
                      <p className="genre-active">music-film </p> and{" "}
                      <p>fashion</p> is in the hand of writting!
                    </div>
                  </div>
                  <img src={film} className="slide-img"></img>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="realative w-full h-full">
                  <h1 className="absolute text-[white] text-4xl top-[42%] ml-[2rem]">
                    Target Blank Magazine
                  </h1>
                  <div className=" absolute text-[white] top-[55%] ml-[2rem]">
                    <div className="flex flex-row gap-[0.3rem] items-center">
                      The survival of <p> technology, </p>
                      <p> politics,</p>
                      <p>music-film </p> and{" "}
                      <p className="genre-active">fashion</p> is in the hand of
                      writting!
                    </div>
                  </div>
                  <img src={pillow} className="slide-img"></img>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>
        <section id="info" className="section container relative ">
          <div className="absolute mt-[-3.5rem] w-full overflow-hidden ">
            <p className="marquee">
              <span>
                What you see it isnt appearantly the truth. Truth is in what you
                believe. &nbsp; &nbsp; &nbsp; &nbsp; What you see it isnt
                appearantly the truth. Truth is in what you believe. &nbsp;
                &nbsp; &nbsp; &nbsp; What you see it isnt appearantly the truth.
                Truth is in what you believe.
              </span>
            </p>
          </div>
          <div className="flex flex-wrap w-full h-full border-b-[0.1rem] border-[#081c15] py-[2rem] pb-[5rem]">
            <div className="relative uppercase w-[30%]">
              <span className="absolute w-[20%] h-[80%] border-r-[0.1rem] border-b-[0.1rem] border-[#081c15] right-0 bottom-0"></span>
              <p className="m-[2rem] text-right font-bold">the real deal</p>
            </div>
            <div className="w-[60%]"></div>
            <div className="flex relative w-[30%] justify-center">
              <div className="flex flex-wrap w-[70%] h-[60%] items-center mx-0 my-[auto]">
                <div className="w-[50%] ">
                  <div className="w-[100px] h-[100px] rounded-[3px] bg-[#081c15]">
                    <span className="flex items-center justify-center spooky-button text-center">
                      Terms & Condition{" "}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex invisible lg:visible w-[50%] justify-center text-center">
                  <GiDandelionFlower className="text-6xl text-center mr-[1rem]" />
                </div>
                <div className="hidden md:flex invisible lg:visible w-[50%] justify-center text-center">
                  <GiDandelionFlower className="text-6xl text-center mr-[1rem]" />
                </div>
                <div className="w-[50%]">
                  <div className="w-[100px] h-[100px]] rounded-[3px] bg-[#081c15]">
                    <span className="flex items-center justify-center spooky-button text-center">
                      {" "}
                      How to post an article{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-[70%]">
              <span className="absolute left-0 w-[30%] h-[40%] pt-[1rem] pl-[1rem] border-l-[0.1rem] border-t-[0.1rem] border-[#081c15]"></span>
              <div className="m-[rem] text-justify mt-[2rem] ml-[2rem] mb-[1rem] leading-8">
                Lets think about the cases someone wants to learn something but
                they couldn't find anywhere. How many of people will be helped
                if you posted out here your articles on that particular topics!
                Probably quite a few, right? Yet it is not only about learning
                how-tos and maybe this is about a huge powerhouse of knowledge.
                The ethics, manner and arts are the builders of ones
                personality. Either way, for each of those different paths
                define your unique thoughts and perspective. And there are
                hundreds, thousands, and millions of users out in the world who
                have different, equally pressing idea, every single day. If you
                put the time and thought and effort surfing through blogs you
                can truly make use you of you valuable time, then why not start
                contributing from today! All you require <br />
                <br />
                <ul className="">
                  <li>&#x219b; Basic writing skill</li>
                  <li>
                    &#x219b; Your passion for the subject that matters.
                  </li>{" "}
                  <li>&#x219b; Your desire to share solutions</li>{" "}
                  <li>&#x219b; Or, information on a specific problem</li>{" "}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="section flex-col gap-[2rem] container h-[550px] justify-center items-center pt-[3rem] border-b-[0.1rem] border-[black]"
        >
          <h1 className=" uppercase font-bold ">~ Features ~</h1>
          <div className="flex w-full h-full gap-[3rem] pt-[3rem] pb-[1rem]">
            <div className="flex justify-between w-[70%] h-[80%] gap-[3rem]">
              {categories.map((cat) => {
                return (
                  <>
                    <div
                      key={`${cat.id}`}
                      className=" w-[31%] h-full text-center overflow-hidden rounded-[5px]"
                    >
                      <div className="flex items-center justify-center content-box relative h-full">
                        <h1 className="content-title flex justify-center items-center text-[#fefae0] text-xl z-[300] p-[0.5rem] ml-[0.275rem] rounded-[10%]">
                          {" "}
                          <Link
                            to={"/show-type-post"}
                            onClick={() => typeToken(cat.name)}
                          >
                            {cat.name}
                          </Link>
                        </h1>
                        <div className="absolute content-img w-full h-full">
                          <img
                            src={`${cat.thumb}`}
                            className="w-full h-full"
                          ></img>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            <div className="flex flex-col justify-between w-[30%] h-full py-[5rem] mt-[-2rem]">
              <div className="flex justify-start relative">
                <div className="bg-[#081c15] w-max h-[100%] rounded-[3px] hover:bg-[#081c15] duration-[500ms]">
                  <h1 className="p-[0.3rem] bg-[#fefae0] border-[0.1rem] border-[#081c15] rounded-[3px] duration-[500ms] px-[0.5rem] translate-x-[-3px] translate-y-[-3px] hover:translate-x-[0] hover:translate-y-[0]">
                    {" "}
                    Six different genre!
                  </h1>
                </div>
              </div>
              <div className="flex justify-center text-right relative right">
                <div className="bg-[#081c15] w-max h-[100%] rounded-[3px] hover:bg-[#081c15] duration-[500ms]">
                  <h1 className="p-[0.3rem] bg-[#fefae0] border-[0.1rem] border-[#081c15] rounded-[3px] duration-[500ms] px-[0.5rem] translate-x-[-3px] translate-y-[-3px] hover:translate-x-[0] hover:translate-y-[0]">
                    {" "}
                    newsletter on every weekend
                  </h1>
                </div>
              </div>
              <div className="flex justify-end text-right relative right">
                <div className="bg-[#081c15] w-max h-[100%] rounded-[3px] hover:bg-[#081c15] duration-[500ms]">
                  <h1 className="p-[0.3rem] bg-[#fefae0] border-[0.1rem] border-[#081c15] rounded-[3px] duration-[500ms] px-[0.5rem] translate-x-[-3px] translate-y-[-3px] hover:translate-x-[0] hover:translate-y-[0]">
                    {" "}
                    Secure & Safe
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="posts"
          className="section container flex-col m-[3rem]
        "
        >
          {" "}
          <h1 className=" uppercase font-bold text-center mb-[3rem]">
            ~ Posts ~
          </h1>
          <div className="popular flex  p-[2rem] pb-[5rem] flex-col gap-[4rem] rounded-[5px] px-[2rem]">
            <h1 className="uppercase text-[#fefae0] w-full font-bold text-center ">
              Popular on this month
            </h1>
            <div className="flex justify-around flex-wrap">
              <div className="flex justify-between flex-wrap py-[3rem]">
                {posts.map((el, indexCount) => {
                  if (indexCount < 3)
                    return (
                      <>
                        <div className="w-[30%] h-[auto] border-[white] bg-[#fefae0] border-[0.1rem]">
                          <div className="mx-[1rem] py-[1rem]">
                            <img
                              src={el.thumbimage}
                              alt=""
                              className="post-image my-[1rem] rounded-[5px] h-[200px]"
                            />
                            <div className="text-left py-[1rem]" key={el.id}>
                              <button
                                onClick={() => postToken(el.id, el.postby)}
                              >
                                <Link to="/show-post">
                                  <h1 className="font-bold text-left">
                                    {el.title}
                                  </h1>{" "}
                                </Link>
                              </button>
                            </div>
                            <div className="text-left">
                              <div className="italic flex items-center gap-[1rem]">
                                {" "}
                                <div className="flex items-center gap-[0.5rem]">
                                  <AiFillStar className="react-star text-[22px]" />
                                  <p> {el.reactcount}</p>
                                </div>
                                - &nbsp;
                                {moment(el.date).format("MMM Do YY")}
                              </div>
                            </div>
                            <div className="text-left py-[1rem]">
                              <p className="">{el.description}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                })}
              </div>
            </div>
          </div>
          <div className="border-b-[0.1rem] border-[#081c15]">
            <div className="flex justify-between flex-wrap py-[3rem]">
              {allPosts
                .sort((b, a) => a.id - b.id)
                .map((el, indexCount) => {
                  if (indexCount < postCount)
                    return (
                      <>
                        <div className="py-[1rem] w-[32%] bg-[#00000010] my-[1rem] p-[0.5rem] px-[1.5rem] rounded-[2px]">
                          <img
                            src={el.thumbimage}
                            alt=""
                            className="post-image my-[1rem] rounded-[5px] h-[250px]"
                          />
                          <div className="text-left py-[1rem]" key={el.id}>
                            <button onClick={() => postToken(el.id, el.postby)}>
                              <Link to="/show-post">
                                <h1 className="font-bold text-left">
                                  {el.title}
                                </h1>{" "}
                              </Link>
                            </button>
                          </div>
                          <div className="text-left">
                            <p className="italic">
                              {moment(el.date).format("MMM Do YY")}
                            </p>
                          </div>
                          <div className="text-left py-[1rem]">
                            <p className="">{el.description}</p>
                          </div>
                        </div>
                      </>
                    );
                })}
            </div>
            <Link
              to={"/all-post"}
              className=" flex flex-col mt-[-1.5rem] mb-[2rem] justify-center items-center"
            >
              <button className="bg-[#081c15] text-[#fefae0] rounded-[50%] w-max px-[1rem] py-[0.5rem] border-[0.1rem] hover:bg-[#fefae0] hover:text-[#081c15] border-[#081c15] duration-[500ms]">
                more
              </button>
            </Link>
          </div>
          <Footer></Footer>
        </section>
      </div>
      <div
        className="flex fixed w-[100vw]  justify-center bottom-[0%] z-[500] duration-[500ms]"
        style={{ height: height }}
      >
        <nav
          id="section-feeder"
          className="container flex flex-row justify-between bg-[#fefae0] border-t-[0.1rem] border-black"
        >
          <div className="flex flex-row justify-center items-center gap-[1.5rem]">
            <div>{moment().format("h:mm a")}</div>
            <li>{moment().format("MMM Do YY")}</li>
          </div>
          <div className="flex flex-row justify-center items-center gap-[2rem]">
            <a
              href="#home"
              className={
                activeSection == "home"
                  ? "uppercase active-section"
                  : "uppercase"
              }
            >
              home
            </a>
            <a
              href="#info"
              className={
                activeSection == "info"
                  ? "uppercase active-section"
                  : "uppercase"
              }
            >
              infos
            </a>
            <a
              href="#features"
              className={
                activeSection == "feature"
                  ? "uppercase active-section"
                  : "uppercase"
              }
            >
              features
            </a>
            <a
              href="#posts"
              className={
                activeSection == "post"
                  ? "uppercase active-section"
                  : "uppercase"
              }
            >
              posts
            </a>
            <a
              href="#footer"
              className={
                activeSection == "support"
                  ? "uppercase active-section"
                  : "uppercase"
              }
            >
              support
            </a>
            {/* <Link to="#home">home</Link> */}
          </div>
          <div className="flex flex-col justify-center">
            <div
              id="newsletter"
              className="flex bg-[#081c15] text-[#fefae0] rounded-[3px]"
            >
              {localStorage.getItem("id") ? (
                <Tippy
                  content={
                    user[0] && user[0].newsletter
                      ? "Subscribed! You'll be in our touch"
                      : "Subscribe to our newsletter!"
                  }
                >
                  <span className="spooky-button">
                    <button
                      disabled={user[0] && user[0].newsletter ? true : false}
                      onClick={subsCribe}
                      className="uppercase"
                    >
                      {user[0] && user[0].newsletter
                        ? "subscribed!"
                        : "Newsletter"}
                    </button>
                  </span>
                </Tippy>
              ) : (
                <Tippy content={"You need to be logged in to subscribe!"}>
                  <span className="spooky-button">
                    <button disabled className="uppercase">
                      newsletter
                    </button>
                  </span>
                </Tippy>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Home;
