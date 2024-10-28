import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


function SuggestedUsers() {
  const { suggestedUsers } = useSelector(store => store.auth);
  // console.log(suggestedUsers);
  return (
    <div className="my-10 ">
      <div className="flex items-center justify-between text-sm">
        <h2 className="font-semibold text-gray-600">Suggested For You.</h2>
        <span className="font-medium cursor-pointer hover:text-blue-500">
          SeeAll
        </span>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div className="flex items-center justify-between my-5 gap-5" key={user._id}>
            <div className="">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${user?._id}`}>
                  <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="post_img" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex  flex-col items-center">
                  <h2 className="font-semibold text-sm  my-1">
                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                  </h2>
                  <span className="text-gray-600 text-sm max-w-28">
                    {user?.bio || "Bio here"}
                  </span>
                </div>
              </div>
            </div>
            <span className=" text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#63aada] ">Follow</span>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUsers;
