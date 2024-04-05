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

  //   updateUser: (form: UpdateUserForm) => Promise<void>;
  //   togglePush: (value: boolean) => Promise<void>;
  //   addtoCart: (medId: number | number[], price: number) => Promise<void>;
  //   deleteFromCart: (cartId: number | number[]) => Promise<void>;

  //   addOrder: (order: Order) => void;

  //   addOwned: (owned: Owned) => void;
  //   editOwnData: (ownedData) => void;
  //   deleteOrder: (id: number) => Promise<void>;
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

  //   updateUser: async () => {},
  //   togglePush: async () => {},
  //   addtoCart: async () => {},
  //   deleteFromCart: async () => {},
  //   addOrder: () => {},
  //   addOwned: () => {},
  //   editOwnData: () => {},
  //   deleteOrder: async () => {},
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

//   const deleteOrder = async (id: number) => {
//     const { error } = await supabase.from("orders").delete().eq("id", id);
//     if (!error) {
//       setRefresh((prev) => !prev);
//       ToastAndroid.show("Deleted", ToastAndroid.SHORT);
//     } else {
//       ToastAndroid.show(error.message, ToastAndroid.SHORT);
//     }
//   };

//   const updateUser = async (form: UpdateUserForm) => {
//     const { error } = await supabase
//       .from("users")
//       .update(form)
//       .eq("uid", userData?.id);
//     if (!error) {
//       setRefresh((prev) => !prev);
//       ToastAndroid.show("Updated", ToastAndroid.SHORT);
//     } else {
//       ToastAndroid.show(error.message, ToastAndroid.SHORT);
//     }
//   };

//   const togglePush = async (value: boolean) => {
//     const { error } = await supabase
//       .from("users")
//       .update({ push_notification: value })
//       .eq("uid", userData?.id);
//     if (!error) {
//       setRefresh((prev) => !prev);
//       ToastAndroid.show("Updated", ToastAndroid.SHORT);
//     } else {
//       ToastAndroid.show(error.message, ToastAndroid.SHORT);
//     }
//   };

//   const addtoCart = async (medId: number | number[], price: number) => {
//     if (Array.isArray(medId)) {
//       for (const id of medId) {
//         await insertIntoCart(id, price);
//       }
//     } else {
//       await insertIntoCart(medId, price);
//     }
//   };

//   const insertIntoCart = async (medId: number, price: number) => {
//     const { error } = await supabase
//       .from("carts")
//       .insert({ added_by: userData?.id, medicine_id: medId, price });
//     if (!error) {
//       setRefresh((prev) => !prev);
//       ToastAndroid.show("Added to Cart", ToastAndroid.SHORT);
//     } else {
//       ToastAndroid.show(error.message, ToastAndroid.SHORT);
//     }
//   };

//   const deleteFromCart = async (cartId: number | number[]) => {
//     if (Array.isArray(cartId)) {
//       for (const id of cartId) {
//         await deleteCartItem(id);
//       }
//     } else {
//       await deleteCartItem(cartId);
//     }
//   };

//   const deleteCartItem = async (cartId: number) => {
//     const { error } = await supabase.from("carts").delete().eq("id", cartId);
//     if (!error) {
//       setRefresh((prev) => !prev);
//       ToastAndroid.show("Removed from Cart", ToastAndroid.SHORT);
//     } else {
//       ToastAndroid.show(error.message, ToastAndroid.SHORT);
//     }
//   };

//   const checkSubcription = async () => {
//     try {
//       supabase
//         .channel("custom-update-channel")
//         .on(
//           "postgres_changes",
//           {
//             event: "UPDATE",
//             schema: "public",
//             table: "user_data",
//             filter: `phn_no=eq.${user[0]?.phn_no}`,
//           },
//           (payload) => {
//             refreshModule();
//             console.log("Change received!", payload);
//           }
//         )
//         .subscribe();
//     } catch (error) {
//       console.error("Error fetching sub data:", error);
//     }
//   };
