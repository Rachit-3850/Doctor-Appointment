import Layout from "../components/layout";
import React from "react";
import { message, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Notification = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const handleMarkAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/get-all-notification",
                {
                    userId: user._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                alert(res.data.message);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            alert("somthing went wrong");
        }
    };
    const handleDeleteAllRead = async() => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/delete-all-notification",
                {
                    userId: user._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                alert(res.data.message);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            alert("somthing went wrong");
        }
    }
    return (
        <div>
            <Layout>
                <h4 className="p-3 text-center">Notification Page</h4>
                <Tabs>
                    <Tabs.TabPane tab="unRead" key={0}>
                        <div className="d-flex justify-content-end">
                            <h4 className="p-2" onClick={handleMarkAllRead}>
                                Mark All Read
                            </h4>
                        </div>
                        {user?.notifcation.map((notificationMgs) => (
                            <div className="card" style={{ cursor: "pointer" }}>
                                <div className="card-text noti" onClick={() => navigate(notificationMgs.onClickPath)}>
                                    {notificationMgs.message}
                                </div>
                            </div>
                        ))}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Read" key={1}>
                        <div className="d-flex justify-content-end">
                            <h4 className="p-2"  onClick={handleDeleteAllRead}>Delete All Read</h4>
                        </div>
                        {user?.seennotification.map((notificationMgs) => (
                            <div className="card" style={{ cursor: "pointer" }}>
                                <div className="card-text noti" onClick={() => navigate(notificationMgs.onClickPath)}>
                                    {notificationMgs.message}
                                </div>
                            </div>
                        ))}
                    </Tabs.TabPane>
                </Tabs>
            </Layout>
        </div>
    );
};

export default Notification;
