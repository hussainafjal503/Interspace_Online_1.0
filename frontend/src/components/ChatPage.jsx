import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setMessages, setSelectedUser } from "@/redux//chatSlice";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import { Input } from "./ui/input";
import Messages from "./Messages";
import axios from "axios";
import store from "@/redux/store";

function ChatPage() {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const { selectedUser } = useSelector((store) => store.chat);
  const { onlineUsers} = useSelector((store) => store.chat);
 
  const {messages}=useSelector(store=>store.chat);
  const dispatch = useDispatch();
  
  // if(!Array.isArray(messages)){
  //   console.log(`not array `,messages);
  // }

 

  //sending message handler function
  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // console.log(`responsed data :`,res.data);
      if (res.data.success) {
        const currentMessages = Array.isArray(messages) ? messages : []; 
        dispatch(setMessages([...currentMessages,res.data.newMessage]));
        setTextMessage("");

      }
    } catch (error) {
      console.log("error in sending message front end: ", error);
    }
  };
  useEffect(()=>{
    return ()=>{
      dispatch(setSelectedUser(null));
    }
  },[])

  /*********  xml codes **************************** */
  return (
    <div className="flex ml-[16%] h-screen py-4">
      <section className="w-60 my-8">
        <h2 className="font-bold mb-4 px-3 text-xl ">{user?.username}</h2>
        <hr className="mb-4 border-gray-300 " />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggesteduser) => {
            // logic of online and offline user
            const isOnline = onlineUsers.includes(suggesteduser._id);

            return (
              <div
                key={suggesteduser?._id}
                onClick={() => dispatch(setSelectedUser(suggesteduser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-300 rounded-md"
              >
                <Avatar className="w-14 h-14 ">
                  <AvatarImage src={suggesteduser?.profilePicture} />
                  <AvatarFallback>PP</AvatarFallback>
                </Avatar>
                <div className="flex flex-col ">
                  <span className="font-medium ">
                    {suggesteduser?.username}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col ">
              <span className="font-bold ">{selectedUser?.username}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages..."
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className=""
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h2 className="font-medium text-xl">Your Messages</h2>
          <span className="">send a message to start a chat...</span>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
