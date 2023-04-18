import React from "react";
import Layout from "../components/layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
    const { user } = useSelector((state) => state.user);
    const [doctors, setDoctors] = useState([]);
    const params = useParams();
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const dispatch = useDispatch();
    const [avialable , setAvialable] = useState(false);
    const [count , setCount] = useState("");
    // const [isAvailable , setAvialable] = useState(false);

    const getDoctorData = async () => {
        try {
            const res = await axios.post(
                "/getDoctorById",
                { doctorId: params.id },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setDoctors(res.data.data);
            }
            console.log(res);
            // setUserInfo(data.data.name);
            // setDoctors(...doctors , res.data);
            // console.log(data.success);
        } catch (e) {
            console.log(e);
        }
    };
    const handleBooking = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/book-appointment",
                {
                    doctorId: params.id,
                    userId: user._id,
                    doctorInfo: doctors,
                    userInfo: user,
                    date: date,
                    time: time,
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
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };
    const handleAvialability = async () => {
        try {
            const res = await axios.post(
                "/booking-availbility",
                { doctorId: params.id, date, time },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
           
            if (res.data.success) {
                setAvialable(true);
                alert(res.data.message);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };
    useEffect(() => {
        getDoctorData();
    }, []);
    return (
        <div>
            <Layout>
                <h3>Booking Page</h3>
                <div className="container m-2">
                    {doctors && (
                        <div>
                            <h4>
                                Dr.{doctors.firstName} {doctors.lastName}
                            </h4>
                            <h4>Fees : {doctors.feesPerCunsaltation}</h4>
                            <h4>
                                Timings : {doctors.timings && doctors.timings[0]} -{" "}
                                {doctors.timings && doctors.timings[1]}{" "}
                            </h4>
                            <div className="d-flex flex-column w-50">
                                <DatePicker
                                    className="m-2"
                                    format="DD-MM-YYYY"
                                    onChange={(value) => setDate(moment(value).format("DD-MM-YYYY"))}
                                />
                                <TimePicker
                                    format="HH:mm"
                                    className="m-2"
                                    onChange={(value) => {
                                        setTime(moment(value).format("HH:mm"));
                                    }}
                                />
                                <button className="btn btn-primary mt-2" onClick={handleAvialability}>
                                    Check Availability
                                </button>
                                {avialable && (
                                    <button className="btn btn-dark mt-2" onClick={handleBooking}>
                                        Book Now
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Layout>
        </div>
    );
};

export default BookingPage;
