import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function useGetAllMessages() {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.chat);

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/message/all/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          // console.log(res.data.posts[0]);
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log("error in get all posts", error);
      }
    };
    fetchAllMessages();
  }, [selectedUser]);
};

export default useGetAllMessages;
