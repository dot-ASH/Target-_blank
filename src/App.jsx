import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import Register from "./components/Register.jsx";
import EditProfile from "./components/EditProfile.jsx";
import ChangePass from "./components/ChangePass.jsx";
import ShowPost from "./components/ShowPost.jsx";
import Viewall from "./components/Viewall.jsx";
import ShowCatPosts from "./components/ShowCatPosts.jsx";
import ShowTypePosts from "./components/ShowTypePosts.jsx";
import Search from "./components/Search.jsx";

const App = () => {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={< Profile />} />
        <Route path="/dashboard" element={< Dashboard />} />
        <Route path="/login" element={< Login />} />
        <Route path="/register" element={< Register />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-pass" element={< ChangePass />} />
        <Route path="/show-post" element={< ShowPost />} />
        <Route path="/all-post" element={< Viewall />} />
        <Route path="/show-cat-post" element={< ShowCatPosts />} />
        <Route path="/show-type-post" element={< ShowTypePosts />} />
        <Route path="/search" element={< Search />} />
      </Routes>
    </>
  );
};

export default App;
