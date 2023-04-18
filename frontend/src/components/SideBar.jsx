import React from "react";
import { Link, NavLink, Navigate } from "react-router-dom";
import { AiFillHome, AiOutlineUnorderedList } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
const SideBar = ({userInfo}) => {
  // console.log(props);
  function handleLogout() {
    localStorage.clear();
  }
    return (
        <div className="sidebar">
            <div className="side-head">
                <h1>{userInfo}</h1>
            </div>
            <div>
                <button>book Appointments</button>
            </div>
            <div className="side-links">
                <Link to={"/"} className="side-item">
                    <div className="font">
                        <AiFillHome />
                    </div>
                    <div className="links">
                            Home
                    </div>
                </Link>
                <Link to={'/appointments'} className="side-item">
                    <div className="font">
                        <AiOutlineUnorderedList />
                    </div>
                    <div className="links">
                            Appointments
                    </div>
                </Link>
                <Link to={'/profile'} className="side-item">
                    <div className="font">
                        <FaUserAlt />
                    </div>
                    <div className="links">
                            Profile
                    </div>
                </Link>
                <NavLink onClick={handleLogout} to={'login'} className="side-item">
                  <div className="font">
                    <IoLogOut />
                  </div>
                  <div className="links">
                        Logout
                  </div>
                </NavLink>
            </div>
        </div>
    );
};

export default SideBar;
