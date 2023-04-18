import React from "react";
import "../styles/register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { showLoading  , hideLoading} from '../redux/features/alertSlice';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    async function registerUser(ev) {
        ev.preventDefault();
        try {
            dispatch(showLoading());
            const {data} =await axios.post("/register", {
                name,
                email,
                password,
            });
            dispatch(hideLoading());
            console.log(data);
            if(data.message === 'User Already Exists') {
                alert("User already Exist")
            }
            else {
                alert("Registration Completed")
                navigate('/login')

            }
        }
        catch(e) {
            dispatch(hideLoading());
            alert("Registration Failed");
        }
    }
    return (
        <div className="form-container">            
            <form className="card p-4 form" onSubmit={registerUser}>
                <div className="text-center">
                    <h1>Register</h1>
                </div>
                <div class="form-group m-2">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                    Register
                </button>
                <div className="text-center">
                <Link to="/login" className="link" >Already have an Account? Login</Link>
                </div>
                </div>
            </form>
        </div>
    );
};

export default Register;
