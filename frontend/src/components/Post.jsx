import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import {
  Bookmark,
  MessageCircleCode,
  MoreHorizontal,
  Send,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { IoStar } from "react-icons/io5";

function Post({ post }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const [liked, setLike] = useState(post.likes.includes(user?._id) || false);
  const [postlike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  //function to handle bookmarks
  const bookmarksHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/post/${post?._id}/bookmark`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(`error in bookmarks frontend: ${error}`);
    }
  };

  //handling comment on post

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");

        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(`error occured in Comment React ${err}`);
    }
  };
  //input handling
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  //deleting post functions
  const deletepostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/post/delete/${post?._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //like and dislike functions
  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:4000/api/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLike = liked ? postlike - 1 : postlike + 1;
        setPostLike(updatedLike);
        setLike(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(`error in like and dislike: ${error}`);
    }
  };

  return (
    <div className="my-8 w-1/2 mr-28 mx-auto ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post.author?.profilePicture}
              alt="post_img"
              className="w-10 h-10 rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <div className="flex gap-3 items-center">
              <h2 className="font-bold">{post.author?.username}</h2>
              {user?._id === post?.author?._id && (
                <Badge variant="secndary">
                  {" "}
                  <IoStar className="mr-3 text-blue-700" />
                  Author
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col shadow-lg items-center text-sm text-center">
            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4156] font-bold border-none outline-none"
              >
                Unfollow
              </Button>
            )}

            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to Favorites
            </Button>

            {user && user._id === post?.author?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit"
                onClick={deletepostHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        src={post.image}
        alt="post_img"
        className="rounded-sm my-2 w-full h-1/2 aspect-square object-cover"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size={"22px"}
              className="cursor-pointer text-red-500"
              onClick={likeOrDislikeHandler}
            />
          ) : (
            <FaRegHeart
              size={"22px"}
              className="cursor-pointer hover:text-red-500"
              onClick={likeOrDislikeHandler}
            />
          )}
          <MessageCircleCode
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-blue-600"
          />
          <Send className="cursor-pointer hover:text-green-600" />
        </div>
        <Bookmark
          onClick={bookmarksHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>
      <span className="font-medium block mb-2">{postlike} likes</span>
      <p>
        <span className="font-bold mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer hover:text-blue-500"
        >
          View all {comment.length} Comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="add a comment"
          className="text-sm outline-none w-full"
          value={text}
          onChange={changeEventHandler}
        />
        {text && (
          <span
            className="p-1 rounded-md bg-[#3BADF8] cursor-pointer"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
