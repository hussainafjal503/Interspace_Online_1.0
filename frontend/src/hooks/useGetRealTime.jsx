import { setMessages } from "@/redux/chatSlice";
import  {setPosts}  from "@/redux/postSlice.js";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


function useGetRealTime() {
  const dispatch = useDispatch();
  const {socket}=useSelector(store=>store.socketio);
  const {messages}=useSelector(store=>store.chat);

  useEffect(() => {

    socket?.on('newMessage' ,(newMessage)=>{
      dispatch(setMessages([...messages,newMessage]));

    })
    return ()=>{
      socket?.off('newMessage');
    }
  }, [messages,setMessages]);
}

export default useGetRealTime;



