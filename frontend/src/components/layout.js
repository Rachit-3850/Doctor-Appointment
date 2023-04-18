import React from "react";
import { Avatar, Badge, Space } from "antd";
import "../styles/LayoutStyles.css";
// import { SidebarMenu } from "./../data/data";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { SidebarMenu, adminMenu, userMenu } from "../data/data";
import { useSelector } from "react-redux";
const Layout = ({ children }) => {
    const handleLogout = () => {
        localStorage.clear();
    };
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.user);
    console.log(user);
    const doctorMenu = [
        {
            name: "Home",
            path: "/",
            icon: "fa-solid fa-house",
        },
        {
            name: "Appointments",
            path: "/doctor-appointments",
            icon: "fa-solid fa-list",
        },
        {
            name: "Profile",
            path: `/doctor/profile/${user?._id}`,
            icon: "fa-solid fa-user",
        },
    ];

    // const Sidebar = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
    // console.log(user?.isDoctor);
    const Sidebar = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
    return (
        <>
            <div className="main">
                <div className="layout">
                    <div className="sidebar">
                        <div className="logo">
                            <h6>DOC APP</h6>
                            <hr />
                        </div>
                        <div className="menu">
                            {Sidebar.map((menu) => {
                                const isActive = location.pathname === menu.path;
                                return (
                                    <>
                                        <div className={`menu-item ${isActive && "active"}`}>
                                            <i className={menu.icon}></i>
                                            <Link to={menu.path}>{menu.name}</Link>
                                        </div>
                                    </>
                                );
                            })}
                            <div className="menu-item">
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <Link to={"/login"} onClick={handleLogout}>
                                    logout
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                            <div className="content-header">
                                <Badge
                                    count={user && user.notifcation.length}
                                    onClick={() => {
                                        user && user.notifcation.length && navigate("/get-all-notifications");
                                    }}
                                >
                                    <i class="fa-solid fa-bell"></i>
                                </Badge>
                                <div className="name">{user?.name}</div>
                            </div>
                        <div className="body">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
