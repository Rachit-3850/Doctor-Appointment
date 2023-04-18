import React from 'react'
import Layout from '../../components/layout'
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";
const Users = () => {
    const [users  , setUsers] = useState([]);
    const getDoctors = async () => {
        // console.log("hello");
        try {
            const res = await axios.get("/get-all-users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUsers(res.data.data);
            console.log(users);
        } catch (error) {
            console.log(error);
            alert("Somthing Went Wrrong");
        }
    };
    useEffect(() => {
        getDoctors();
    }, []);
    const columns = [
        {
          title: "Name",
          dataIndex: "name",
        },
        {
          title: "Email",
          dataIndex: "email",
        },
        {
          title: "Doctor",
          dataIndex: "isDoctor",
          render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
        },
        {
          title: "Actions",
          dataIndex: "actions",
          render: (text, record) => (
            <div className="d-flex">
              <button className="btn btn-danger">Block</button>
            </div>
          ),
        },
      ];
  return (
    <Layout>
    <h1 className="text-center m-2">Users List</h1>
    <Table columns={columns} dataSource={users} />
  </Layout>
  )
}

export default Users
