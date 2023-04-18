import React from "react";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar.jsx";
import axios from "axios";
import row from "antd";
import Layout from "../components/layout.js";
import DoctorList from "../components/DoctorList.jsx";

function Homepage() {
    // const [userInfo, setUserInfo] = useState("");
    const [doctors, setDoctors] = useState([]);
    const getDoctorData = async () => {
        try {
            const res = await axios.get("/getAllDoctors", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            console.log("hi",res.data.data);
            if (res.data.success) {
                // console.log()
                console.log("hii",res.data.data);
                setDoctors(res.data.data);
            }
            // setUserInfo(data.data.name);
            // setDoctors(...doctors , res.data);
            // console.log(data.success);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getDoctorData();
    }, []);
    return (
        <Layout>
            {console.log("docot",doctors)}
            <div className="homePage">{doctors && doctors.map((doctor) => <DoctorList doctor={doctor} />)}</div>
        </Layout>
    );
}

export default Homepage;
