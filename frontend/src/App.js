import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import "antd/dist/reset.css";
import Register from "./pages/Register";
import axios from "axios";
import "./styles/home.scss";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRouter from "./components/PublicRouter";
import { useSelector } from "react-redux";
import Spinner from "./components/spinner";
import ApplyDocter from "./pages/ApplyDocter";
import Notification from "./pages/Notification";
import Docters from "./pages/admin/docters";
import Users from "./pages/admin/users";
import Profile from "./pages/doctor/profile";
import BookingPage from "./pages/BookingPage";
import Appointments from "./pages/appointments";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
    const { loading } = useSelector((state) => state.alerts);
    return (
        <>
            <BrowserRouter>
                {loading ? (
                    <Spinner />
                ) : (
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Homepage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/apply-doctor"
                            element={
                                <ProtectedRoute>
                                    <ApplyDocter />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/get-all-notifications"
                            element={
                                <ProtectedRoute>
                                    <Notification />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/docters"
                            element={
                                <ProtectedRoute>
                                    <Docters />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute>
                                    <Users />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/doctor/profile/:id"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/appointments"
                            element={
                                <ProtectedRoute>
                                    <Appointments />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/doctor-appointments"
                            element={
                                <ProtectedRoute>
                                    <DoctorAppointments />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/doctor/book-appointment/:id"
                            element={
                                <ProtectedRoute>
                                    <BookingPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PublicRouter>
                                    <Login />
                                </PublicRouter>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRouter>
                                    <Register />
                                </PublicRouter>
                            }
                        />
                    </Routes>
                )}
            </BrowserRouter>
        </>
    );
}

export default App;
