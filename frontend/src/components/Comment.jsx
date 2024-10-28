import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Comment({ comment }) {


  

  /********************xml codes ************************/
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>PP</AvatarFallback>
        </Avatar>
        <h2 className="font-bold text-sm">
          {comment?.author?.username}{" "}
          <span className="font-normal pl-1">{comment?.text}</span>{" "}
        </h2>
      </div>
    </div>
  );
}

export default Comment;
