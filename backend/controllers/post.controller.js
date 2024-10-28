import User from "../models/user.models.js";
import Post from "../models/post.models.js";
import Comment from "../models/comment.models.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.utils.js";
import { response } from "express";
import {getReceiverSockedId, io} from '../socket/socket.js';

/**************************** create post function   *******************************/
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "image required :",
      });
    }

    //imageupload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //buffer to data uri conversion
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    console.warn(post);
    //finding user to push posts array;
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      post,
      message: "New post Added...",
      success: true,
    });
  } catch (err) {
    // console.log(`Error in postnew ${err}`);

    return res.status(400).json({
      message: "unable to add post",
      success: false,
    });
  }
};

/*************************  get post function   ***************************/

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (err) {
    console.log(`Error occured in getpost ${err}`);
  }
};

/****************** get only user post function *************************/

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({
      author: authorId,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username,profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (err) {
    console.log(`Error in user post ${err}`);
  }
};

/*************************  like    ********************/

export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    //like logic
    await Post.updateOne({ $addToSet: { likes: likeKrneWalaUserId } });
    await post.save();

    //implementing socket io for real time notification...left

    const user=await User.findById(likeKrneWalaUserId).select('username profilePicture');
    const postOwnerId=post?.author?.toString();
    if(postOwnerId!== likeKrneWalaUserId){
      //emit a notification event
      const notification ={
        type:'like',
        userId:likeKrneWalaUserId,
        userDetails:user,
        postId,
        message:'your post was liked...'
      }
      const postOwnerSocketId=getReceiverSockedId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification', notification);
    }

    return res.status(200).json({
      message: "post liked..",
      success: true,
    });
  } catch (err) {
    console.log(`Erro in like ${err}`);
  }
};

/********************  dislike feature function    ********************/

export const disLikePost = async (req, res) => {
  try {
    const likeKrneWalaUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    //like logic
    await Post.updateOne({ $pull: { likes: likeKrneWalaUserId } });
    await post.save();

    //implementing socket io for real time notification...left

    const user=await User.findById(likeKrneWalaUserId).select('username profilePicture');
    const postOwnerId=post?.author?.toString();
    if(postOwnerId!== likeKrneWalaUserId){
      //emit a notification event
      const notification ={
        type:'dislike',
        userId:likeKrneWalaUserId,
        userDetails:user,
        postId,
        message:'your post was disliked...'
      }
      const postOwnerSocketId=getReceiverSockedId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification', notification);
    }

    return res.status(200).json({
      message: "post disliked..",
      success: true,
    });
  } catch (err) {
    console.log(`Erro in dislike ${err}`);
  }
};

/************************** add comment functions ************* */

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text) {
      return res.status(400).json({
        message: "text is Required",
        success: false,
      });
    }

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    })

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "comment added..",
      comment,
      success: true,
    });
  } catch (err) {
    console.log(`Error in addComment ${err}`);
  }
};

/********************** get post specific comment ***************/

export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );

    if (!comments) {
      return res
        .status(404)
        .json({ message: "No comments...", success: false });
    }

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (err) {
    console.log(`error postcommets ${err}`);
  }
};

/************************** Deleting post funtion *********************/

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    //checking the userlogged in or not before deleting the post..

    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "Unauthorized you can delete it ......",
        success: false,
      });
    }

    //deleting post;
    await Post.findByIdAndDelete(postId);

    //remove the post id from the user's post
    let user = await User.findById(authorId);
    user.post = user.posts.filter((id) => id.toString() === postId);
    await user.save();

    //deleting associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post Deleted..",
      success: true,
    });
  } catch (err) {
    console.log(`Error occured deletepost :${err}`);
  }
};

/****************** Bookmark features functions *********************/
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "post not found ..", sucess: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      //already bookmarked ---> remove from the bookmarked
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "post removed from bookmarked",
        success: true,
      });
    } else {
      //bookmarked the post

      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "Post Bookmarked",
        success: true,
      });
    }
  } catch (err) {
    console.log(`bookmark error ${err}`);
  }
};
