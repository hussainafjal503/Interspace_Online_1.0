import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { set } from "redux-tools/persist";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function CreatePost({ open, setOpen }) {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch =useDispatch();
  const {user}=useSelector(store=>store.auth);
  const {posts}=useSelector(store=>store.post)
  // console.log(user);

  //file handling function..........
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  //create post handler, submitting the post
  const createPostHandler = async (e) => {
  
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
   
    try {
      // console.log(file,caption)
      setLoading(true);
      
      const res = await axios.post(
        "http://localhost:4000/api/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        }
      );

      if (res.data.success) {
        
        // console.log(res.data)
        dispatch(setPosts([res.data.post, ...posts]));  //after adding the the total element is increased by one after posting another post
        toast.success(res.data.message);
        // console.log(res.data?.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
      setCaption("");
      setImagePreview("");
    }
  };

  /********************* xml code  ***********************/
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <hr />
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="">
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a Caption......!!"
        />
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="previewImg"
              className="w-full h-full rounded-md object-cover "
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095f6] hover:bg-[#4b94c5]"
        >
          Select From Device
        </Button>
        {caption &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 m-4">Please Wait.....</Loader2>
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full"
              onClick={createPostHandler}
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
