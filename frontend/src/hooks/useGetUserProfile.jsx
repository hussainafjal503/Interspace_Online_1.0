import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function useGetUserProfile(userId ) {
  const dispatch = useDispatch();
  // const [userProfile,setUserProfile]=useState(null);

  useEffect(() => {
    if (!userId) {
      console.log(`no user id provided, skipping fetching`);
      return;
    }
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          // console.log(res.data.posts[0]);
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log("error in user profile", error);
      }
    };
    fetchUserProfile();
  }, [dispatch, userId]);
}

export default useGetUserProfile;
