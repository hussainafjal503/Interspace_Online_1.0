import  {setPosts}  from "@/redux/postSlice.js";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";


function useGetAllPost() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/post/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          // console.log(res.data.posts[0]);
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log("error in get all posts", error);
      }
    };
    fetchAllPost();
  }, []);
}

export default useGetAllPost;
