// import {User} from '../models/user.models.js';
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.utils.js";
import Post from '../models/post.models.js'
import  Mongoose  from "mongoose";

//******************** Registration Function ********************* */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //checking that required field is not empty
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, Please Check",
        success: false,
      });
    }

    //finding the user, already exist or not
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Account Already Exists.....!!",
        success: false,
      });
    }

    //password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    //account creation
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //account creation message to the user
    return res.status(201).json({
      message: "Account Created Successfully.......",
      success: true,
    });
  } catch (err) {
    console.log(`Error Occured : ${err}`);
  }
};

/******************* login function************************/

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check that required field is not empty
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is Missing.....!!",
        success: false,
      });
    }

    //user finding
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect Email or Password",
        success: false,
      });
    }

    //password comparison
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect Email or Password",
        success: false,
      });
    }

    
    //token generation for cookies
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    
    //creating user object to return the object to frontend for render the details of user after succesfully login..
    //populate each post if the posts array
    const populatedPost=await Promise.all(
      user.posts.map(async (postId)=>{
        const post=await Post.findById(postId);
        if(post && post.author.equals(user._id)){
          return post;
        }
        return null;
      })
    ).then((results)=>results.filter((post)=>post!==null));


    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPost
    };


    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back..${user.username} `,
        success: true,
        user,
      });
  } catch (err) {
    console.log(`Error Occured in Login : ${err}`);
    return res.status(500).json({
      message:"Error occured in Login",
      success:false
    })
  }
};

// ******************** logout function ****************************/

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Log Out Successfully",
      success: true,
    });
  } catch (err) {
    console.log(`Error Occured while LogOut : ${err}`);
  }
};

// ******************* get profile function  ******************/

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    //checking user id send by the front end or not
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Check if `userId` is a valid ObjectId
    // if (!Mongoose.Types.ObjectId.isValid(userId)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid User ID",
    //   });
    // }


    const user = await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks')

     // Check if the user exists
     if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (err) {
    console.log(`Error in get profile ${err}`);
    return res.status(500).json({
      success: false,
      message: "Error retrieving user profile",
    });
  }
};

// ***********  Edit profile function *************************/

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    // console.log(profilePicture);

    // cloudinary used here
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      // console.log(`file uri : ${fileUri}`)
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile Updated Successfully...",
      success: true,
      user,
    });
  } catch (err) {
    console.log(`Error while profile editing ${err}`);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ********************* sugested users function *******************

export const getSuggestedUser = async (req, res) => {
  try {
    const suggestUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestUsers) {
      return res.status(400).json({
        message: "currently do not have any Suggested Users",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestUsers,
    });
  } catch (err) {
    console.log(`error in suggested ${err}`);
  }
};

//************  follow and unfollow funtions  *********************/

export const followOrUnfollow = async (req, res) => {
  try {
    const followKarneWala = req.id;
    const jiskoFollowkarunga = req.params.id;
    if (followKarneWala === jiskoFollowkarunga) {
      return res.status(400).json({
        message: "You can not follow and Unfollow YourSelf",
        success: false,
      });
    }

    const user = await User.findById(followKarneWala);
    const targetUser = await User.findById(jiskoFollowkarunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not Found",
        success: false,
      });
    }

    //follow and unfollow logic
    const isFollowing = user.following.includes(jiskoFollowkarunga);
    if (isFollowing) {
      //already followed so unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKarneWala },
          { $pull: { following: jiskoFollowkarunga } }
        ),

        User.updateOne(
          { _id: jiskoFollowkarunga },
          { $pull: { followers: followKarneWala } }
        ),
      ]);

      return res.status(200).json({
        message: "Unfollowed Successfully..",
        success: true,
      });
    } else {
      //follow logic
      await Promise.all([
        User.updateOne(
          { _id: followKarneWala },
          { $push: { following: jiskoFollowkarunga } }
        ),

        User.updateOne(
          { _id: jiskoFollowkarunga },
          { $push: { followers: followKarneWala } }
        ),
      ]);

      return res.status(200).json({
        message: "followed Successfully..",
        success: true,
      });
    }
  } catch (err) {
    console.log(`error occured in follow and unfollow ${err}`);
  }
};
