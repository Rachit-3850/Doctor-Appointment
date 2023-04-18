import React from 'react'
import "../styles/register.css"
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { showLoading  , hideLoading} from '../redux/features/alertSlice';
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    async function loginUser(ev) {
        ev.preventDefault();
        try{
            dispatch(showLoading());
            const {data} = await axios.post("/login", {
                email,
                password,
            });
            dispatch(hideLoading());
            window.location.reload()
            // console.log(userInfo)
            if(data.message ==='login successfully') {
                localStorage.setItem("token" , data.token);
                alert("You have successfully logged in");
                navigate("/");
            }
            else if(data.message ==='Wrong Password') {
                alert("Wrong Password");
            }
            else {
                alert("Invalid Email");
            }
            console.log("login succesfull");
        }
        catch(e) {
            dispatch(hideLoading());
            alert("login failed");
        }
    }
    return (
        <div className="form-container ">
            
            <form className="card p-4 form" onSubmit={loginUser}>
                <div className="text-center">
                    <h1>Login</h1>
                </div>
                
                <div class="form-group m-2">
                    <label for="exampleInputEmail1">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div class="form-group m-2">
                    <label for="exampleInputPassword1">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="button">
                <button type="submit" className="btn btn-primary w-100">
                    Login
                </button>
                <div className="text-center">
                <Link to="/register" className="link" >Not have an Account? Register</Link>
                </div>
                </div>
            </form>
        </div>
    );
};
export default Login


