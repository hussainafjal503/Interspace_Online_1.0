import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch =useDispatch()
  const navigate=useNavigate();
  const {user}=useSelector(store=>store.auth);

  //value change in input
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  //singup handler function
  const signupHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:4000/api/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (err) {
      console.error(`error in signuphandler ${err}`);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(user){
      navigate('/');
    }
  },[])

  /*******************  xml codes */
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8 rounded-md"
      >
        <div className="my-4">
          <img
            src={logo}
            alt="logo"
            className="w-24  mt-0 rounded-md mx-auto"
          />
          <h2 className="text-center font-bold my-2 text-2xl">
            Inter<span className="text-blue-500">Space</span> Online
          </h2>
          <h2 className="text-2xl text-blue-700 font-bold my-2">LogIn</h2>
          <p className="">LogIn to connect and explore Post shared by your friends!</p>
          {/* <p className='font-bold my-2 mx-auto'>It's Quick and Easy</p> */}
        </div>

        <div>
          <Label className="font-bold">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>

        <div>
          <Label className="font-bold">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 animate-spin" />
            Please Wait....
          </Button>
        ) : (
          <Button className="font-bold" type="submit">
            LogIn
          </Button>
        )}

        <span className="text-center">
          Doesn't have an Account?.{" "}
          <Link className="text-blue-600 " to="/signup">
            SignUp
          </Link>{" "}
        </span>
      </form>
    </div>
  );
}

export default Login;
