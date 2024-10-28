import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

function EditProfile() {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  //handling all input one state
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    // console.log(e.target.files?.[0]);
    if (file) {
      setInput({ ...input, profilePhoto: file });
    }
  };
  const selecteChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  //calling backend
  const editProfileHandler = async () => {
    console.log(input);
    const formData = new FormData();
    if (input.bio) {
      formData.append("bio", input.bio);
    }
    if (input.gender) {
      formData.append("gender", input.gender);
    }

    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/api/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multiparts/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data?.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data?.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(`Error in editProfile FrontEnd : ${error}`);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  /*****************************xml codes ******************************/
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h2 className="font-bold text-xl"></h2>
        <div className="">
          <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.profilePicture} alt="post_img" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex  flex-col items-center">
                <h2 className="font-bold text-xl ">{user?.username}</h2>
                <span className="text-gray-600 text-sm">
                  {user?.bio || "Bio here"}
                </span>
              </div>
            </div>
            <input
              ref={imageRef}
              onChange={fileChangeHandler}
              type="file"
              className="hidden"
            />
            <Button
              onClick={() => imageRef?.current.click()}
              className="bg-[#0095f6] h-8 hover:bg-[#3677a1]"
            >
              Change Avatar
            </Button>
          </div>
          <div className="">
            <h2 className="font-bold text-xl mb-2">Bio</h2>
            <Textarea
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              name="bio"
              className="focus:visible:ring-transparent"
            />
          </div>
          <div className="">
            <h2 className="font-bold mb-2">Gender</h2>
            <Select
              defaultValue={input.gender}
              onValueChange={selecteChangeHandler}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit bg-[#0095f6] hover:bg-[#357199]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin " />
              Please Wait...
            </Button>
          ) : (
            <Button
              className="w-fit bg-[#0095f6] hover:bg-[#357199]"
              onClick={editProfileHandler}
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
