import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.scss";
import { FaDiscord, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  
  return (
    <>
      <section
        id="footer"
        className="section h-[400px] w-full bg-[#081c15] text-[#fefae0]"
      >
        <div className="flex flex-col w-full justify-between p-[4rem] px-[7rem] pb-[4rem]">
          <div className="flex justify-between">
            <div className="idea flex flex-col gap-[1rem]">
              <a href="/">Home</a>
              <p>Essay</p>
              <p>Ideas</p>
              <p>Videos</p>
            </div>
            <div className="contact flex flex-col gap-[1rem]">
              <p>About us</p>
              <p>Contact Infos</p>
            </div>
            <div className="dev flex flex-col gap-[1rem]">
              <p>API</p>
              <p>RSS feed</p>
              <p>Community</p>
            </div>
            <div className="social flex flex-col gap-[1rem]">
              <p>Follow us</p>
              <div className="flex gap-[1rem]">
                <FaFacebook />
                <FaInstagram />
                <FaTwitter />
                <FaDiscord />
              </div>
            </div>
          </div>
          <p className="">
            © Target:_blank 2023-2026. Privacy Policy. Terms of Use
          </p>
        </div>
      </section>
    </>
  );
};

export default Footer;
