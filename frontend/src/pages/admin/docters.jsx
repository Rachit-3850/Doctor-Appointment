import React from "react";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const getDoctors = async () => {
        // console.log("hello");
        try {
            const res = await axios.get("/get-all-doctors", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setDoctors(res.data.data);
            console.log(doctors);
        } catch (error) {
            console.log(error);
            alert("Somthing Went Wrrong");
        }
    };
    const handleApprove = async (record, status) => {
        console.log("hello approve");
        // try {
            const res = await axios.post(
                "/change-account-status",
                { doctorId: record._id, userId: record.userId, status: status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                alert(res.data.message);
                window.location.reload();
            }
        // } catch (error) {
        //     console.log(error);
        //     alert("Somthing Went Wrong");
        // }
    };
    useEffect(() => {
        getDoctors();
    }, []);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => (
                <span>
                    {record.firstName} {record.lastName}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "phone",
            dataIndex: "phone",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    {record.status === "pending" ? (
                        <button className="btn btn-success" onClick={()=> handleApprove(record , 'approved')}>
                            Approve
                        </button>
                    ) : (
                        <button className="btn btn-danger">Reject</button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <h1 className="text-center m-3">All Doctors</h1>
            <Table columns={columns} dataSource={doctors} />
        </Layout>
    );
};

export default Doctors;
