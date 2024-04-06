"use client";

import api from "@/data/api";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";

interface DataContextType {
  user: User | null;
  users: User[];
  posts: Post[];
  categories: Category[];
  comments: PostComment[];
  postReact: PostReact[];
  saved: Saved[];
  loading: boolean;
  refreshModule: () => void;
}

const DataContext = createContext<DataContextType>({
  user: null,
  users: [],
  posts: [],
  categories: [],
  comments: [],
  postReact: [],
  saved: [],
  loading: true,
  refreshModule: () => {},
});

const DataProvider = ({ children }: { children: ReactNode }) => {
  const userData = { id: 1 };
  const [toggleRefresh, setRefresh] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comments, setComment] = useState<PostComment[]>([]);
  const [postReact, setPostReact] = useState<PostReact[]>([]);
  const [saved, setSaved] = useState<Saved[]>([]);

  const refreshModule = () => {
    setRefresh((prev) => !prev);
  };

  const getUserData = useCallback(async () => {
    if (userData) {
      try {
        const { data } = await api.get("users");
        setUsers(data);
        const foundUser = data.find((users: User) => users.id === 1);
        setUser(foundUser);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
  }, [toggleRefresh]);

  const getPostData = useCallback(async () => {
    try {
      const { data } = await api.get("posts");
      const sortedPosts: Post[] = [...data].sort(
        (a, b) => b.reactcount - a.reactcount
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [toggleRefresh]);

  const getCategoriesData = useCallback(async () => {
    try {
      const { data } = await api.get("categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [toggleRefresh]);

  const getSavedData = useCallback(async () => {
    if (userData) {
      try {
        const { data } = await api.get("saved");
        const myData: Saved[] = data.filter(
          (saved: { savedby: number }) => saved.savedby === userData.id
        );
        setSaved(myData);
      } catch (error) {
        console.error("Error fetching Saved:", error);
      }
    }
  }, [toggleRefresh]);

  const getPostReactData = useCallback(async () => {
    if (userData) {
      try {
        const { data } = await api.get("reacts");
        const myData: PostReact[] = data.filter(
          (react: { reactby: number }) => react.reactby === userData.id
        );
        setPostReact(myData);
      } catch (error) {
        console.error("Error fetching PostReact:", error);
      }
    }
  }, [toggleRefresh]);

  const getCommentData = useCallback(async () => {
    try {
      const { data } = await api.get("comments");
      setComment(data);
    } catch (error) {
      console.error("Error fetching Comments:", error);
    }
  }, [toggleRefresh]);

  const dataFetchingFunctions = [
    getUserData,
    getPostData,
    getCommentData,
    getSavedData,
    getPostReactData,
    getCategoriesData,
  ];

  useEffect(() => {
    dataFetchingFunctions.forEach((fetchData) => fetchData());
  }, dataFetchingFunctions);

  // useEffect(() => {
  //   setLoading(false);
  // }, []);

  return (
    <DataContext.Provider
      value={{
        user,
        users,
        posts,
        categories,
        comments,
        postReact,
        saved,
        loading,
        refreshModule,
      }}
    >
      {/* {loading || typeof loading === "undefined" ? ( */}
      {/* <div>loading...</div>
      ) : ( */}
      {children}
      {/* )} */}
    </DataContext.Provider>
  );
};

const useData = (): DataContextType => {
  return useContext(DataContext);
};

export { DataProvider, useData };
