import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function useGetSuggestedUsers() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggesteUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/user/suggested",
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          // console.log(res.data.posts[0]);
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log("error in get all posts", error);
      }
    };
    fetchSuggesteUsers();
  }, []);
}

export default useGetSuggestedUsers;
