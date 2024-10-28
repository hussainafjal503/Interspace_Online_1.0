import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  //statemanage
  const [active, setActive] = useState("posts");

  const { userProfile,user } = useSelector((store) => store.auth);
  // console.log(userProfile);

  const isLoggedInProfile = user?._id ===userProfile?._id;
  const isFollowing = false;

  //handling tab changing

  const handleTabChange = (tab) => {
    setActive(tab);
  };

  const displayedPost =
    active === "posts" ? userProfile?.posts : userProfile?.posts;

  /******************xml codes ****************************** */
  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2 ">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilePhoto"
                className=""
              />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
          </section>
          <section className="">
            <div className="flex flex-col gap-5 ">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold mr-5">{userProfile?.username}</h2>
                {isLoggedInProfile ? (
                  <>
                    <Link to={`/account/edit`}>
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8 "
                      >
                        Edit Profile
                      </Button>
                    </Link>

                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8 "
                    >
                      View Archive
                    </Button>

                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8 "
                    >
                      Add Tool
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className=" h-8  hover:bg-[#f03a3a]"
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant="secondary"
                      className=" h-8  hover:bg-[#a4b843]"
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      className="bg-[#0095f6] h-8  hover:bg-[#326689]"
                    >
                      Follow
                    </Button>
                    <Button
                      variant="secondary"
                      className=" h-8  hover:bg-[#a4b843]"
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-5">
                <p className="font-semibold">
                  {userProfile?.posts.length}{" "}
                  <span className="font-normal ">posts</span>
                </p>
                <p className="font-semibold">
                  {userProfile?.followers.length}{" "}
                  <span className="font-normal ">Followers</span>
                </p>

                <p className="font-semibold">
                  {userProfile?.following.length}{" "}
                  <span className="font-normal">Following</span>
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "Bio Here...."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign className="text-xs" />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span className="">Learning code</span>
                <span className="">Learning code</span>
                <span className="">Learning code</span>
              </div>
            </div>
          </section>
        </div>
        <div className=" border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer  ${
                active === "posts"
                  ? "font-bold border-b-2 border-b-blue-500 "
                  : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              Posts
            </span>
            <span
              className={`py-3 cursor-pointer ${
                active === "saved"
                  ? "font-bold border-b-2 border-b-blue-500 "
                  : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              Saved
            </span>
            <span
              className={`py-3 cursor-pointer  ${
                active === "reels"
                  ? "font-bold border-b-2 border-b-blue-500"
                  : ""
              }`}
              onClick={() => handleTabChange("reels")}
            >
              Reels
            </span>
            <span
              className={`py-3 cursor-pointer ${
                active === "tags"
                  ? "font-bold border-b-2 border-b-blue-500"
                  : ""
              }`}
              onClick={() => handleTabChange("tags")}
            >
              Tags
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-md my-2 w-full aspect-square object-cover "
                  />
                  <div className="rounded-md absolute inset-0 flex items-center justify-center bg-black bg-opacity-50  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span className="">{post?.likes?.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span className="">{post?.comments?.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
