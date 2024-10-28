import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

function RightSidebar() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit my-10 pr-36 ">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

       
          <div className="flex  flex-col items-center">
            <h2 className="font-semibold text-sm "><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h2>
            <span className="text-gray-600 text-sm max-w-48">{user?.bio || "Bio here"}</span>
          
        </div>
      </div>

      <SuggestedUsers/>
    </div>
  );
}

export default RightSidebar;
