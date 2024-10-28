import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

function Signup() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
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
        "http://localhost:4000/api/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login")
        toast.success(res.data.message);
        setInput({
          username: "",
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

  /**********************xml codes */

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
          <h2 className="text-2xl text-blue-700 font-bold my-2">SignUp</h2>
          <p className="">Signup to connect and explore Post shared by your friends!</p>
          {/* <p className='font-bold my-2 text-center'>It's Quick and Easy</p> */}
        </div>

        <div>
          <Label className="font-bold">Username</Label>
          <Input
            type="text"
            name="username"
            value={input.usersername}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
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
            <Loader2 className="mr-2 h-3 animate-spin" />
            Please Wait....
          </Button>
        ) : (
          <Button className="font-bold" type="submit">
          SignUp
          </Button>
        )}


       
        <span className='text-center'>Already have an Account?. <Link className='text-blue-600' to='/login'>Login</Link> </span>
      </form>
    </div>
  );
}

export default Signup;
