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
import { useAuth } from "./AuthProvider";
import Loading from "@/components/Loading";

interface DataContextType {
  user: User | null;
  users: User[];
  posts: Post[];
  categories: Category[];
  comments: PostComment[];
  postReact: PostReact[];
  saved: Saved[];
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
  refreshModule: () => {},
});

const DataProvider = ({ children }: { children: ReactNode }) => {
  const { sessionUser, initialized, session } = useAuth();
  const [toggleRefresh, setRefresh] = useState<boolean>();
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
    try {
      const { data } = await api.get("users");
      setUsers(data);
      if (sessionUser) {
        const foundUser = data.find(
          (users: User) => users.id === parseInt(sessionUser.id, 10)
        );
        setUser(foundUser);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [session, toggleRefresh, sessionUser]);

  const getPostData = useCallback(async () => {
    try {
      const { data } = await api.get("posts");
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [session, toggleRefresh]);

  const getCategoriesData = useCallback(async () => {
    try {
      const { data } = await api.get("categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [session, toggleRefresh]);

  const getSavedData = useCallback(async () => {
    if (sessionUser) {
      try {
        const { data } = await api.get("saved");
        const myData: Saved[] = data.filter(
          (saved: { savedby: number }) =>
            saved.savedby === parseInt(sessionUser.id, 10)
        );
        setSaved(myData);
      } catch (error) {
        console.error("Error fetching Saved:", error);
      }
    }
  }, [session, toggleRefresh]);

  const getPostReactData = useCallback(async () => {
    if (sessionUser) {
      try {
        const { data } = await api.get("reacts");
        const myData: PostReact[] = data.filter(
          (react: { reactby: number }) =>
            react.reactby === parseInt(sessionUser.id, 10)
        );
        setPostReact(myData);
      } catch (error) {
        console.error("Error fetching PostReact:", error);
      }
    }
  }, [session, toggleRefresh]);

  const getCommentData = useCallback(async () => {
    try {
      const { data } = await api.get("comments");
      setComment(data);
    } catch (error) {
      console.error("Error fetching Comments:", error);
    }
  }, [session, toggleRefresh]);

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
        refreshModule,
      }}
    >
      {!initialized ? <Loading /> : children}
    </DataContext.Provider>
  );
};

const useData = (): DataContextType => {
  return useContext(DataContext);
};

export { DataProvider, useData };
