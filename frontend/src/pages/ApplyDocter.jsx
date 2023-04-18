import React from "react";
import Layout from "../components/layout";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment"

const ApplyDocter = () => {
    const { user } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleFinish = async (values) => {
        console.log("apply-doctor" ,values);
        
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/apply-doctor",
                {
                    ...values,
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
                alert(res.data.success);
                navigate("/");
            } else {
                alert(res.data.success);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            alert("Somthing Went Wrrong");
        }
    };
    return (
        <div>
            <Layout>
                <h1 className="text-center">Apply Doctor</h1>
                <Form layout="vertical" className="m-3" onFinish={handleFinish}>
                    <h4 className="">Personal Details : </h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="First Name" name="firstName" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your first name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Last Name" name="lastName" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your last name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Phone No" name="phone" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your contact no" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Email" name="email" required rules={[{ required: true }]}>
                                <Input type="email" placeholder="your email address" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Website" name="website">
                                <Input type="text" placeholder="your website" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Address" name="address" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your clinic address" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h4>Professional Details :</h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Specialization"
                                name="specialization"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="your specialization" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Experience" name="experience" required rules={[{ required: true }]}>
                                <Input type="text" placeholder="your experience" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Fees Per Cunsaltation"
                                name="feesPerCunsaltation"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="your contact no" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Timings" name="timings" required>
                                <TimePicker.RangePicker format="HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}></Col>
                        <Col xs={24} md={24} lg={8}>
                            <button className="btn btn-primary form-btn" type="submit">
                                Submit
                            </button>
                        </Col>
                    </Row>
                </Form>
            </Layout>
        </div>
    );
};

export default ApplyDocter;
