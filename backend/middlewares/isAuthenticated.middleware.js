import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    //storing cookies token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not Authenticated",
        success: false
      });
    }

    //verifying tokens
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    req.id = decode.userId;
    next();
  } catch (err) {
    console.log(`Error occured isAuthenticate ${err}`);
  }
};

export default isAuthenticated;