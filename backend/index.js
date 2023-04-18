const express = require("express");
const bcrypt = require("bcrypt");
const colors = require("colors");
const morgan = require("morgan");
var cors = require("cors");
const User = require("./models/users.jsx");
const doctor = require("./models/docterModel.jsx");
const appointmentModel = require("./models/appointmentModel.jsx");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const auth = require("./middlewares/authMiddleware.js");
const moment = require("moment");
dotenv.config();

const app = express();

const bcryptSalt = 10;
app.use(express.json());
app.use(morgan("dev"));
app.use(
    cors({
        credentials: true,
        origin: "http://127.0.0.1:3000",
    })
);

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connection complete");
    // use await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test'); if your database has auth enabled
}
// app.use('/', routes);
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(200).send({ message: "User Already Exists" });
        }
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const userDoc = await User.findOne({ email });
        if (userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                const token = jwt.sign({ id: userDoc._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
                res.status(200).send({ message: "login successfully", token });
            } else {
                res.status(422).send({ message: "Wrong Password", token });
            }
        } else {
            res.send({ message: "Invalid Email", token });
        }
    } catch (e) {
        res.status(422).json(e);
    }
});
app.post("/getUserData", auth, async (req, res) => {
    try {
        const userDoc = await User.findOne({ _id: req.body.userId });
        if (!userDoc) {
            return res.status(200).send({ message: "user not found", success: false });
        } else {
            res.status(200).send({
                success: true,
                data: {
                    name: userDoc.name,
                    email: userDoc.email,
                    isAdmin: userDoc.isAdmin,
                    isDoctor: userDoc.isDoctor,
                    notifcation: userDoc.notifcation,
                    seennotification: userDoc.seennotification,
                    _id: userDoc._id,
                },
            });
        }
        console.log(userDoc);
    } catch (err) {
        res.status(200).send({ message: "error", success: false });
    }
});
app.post("/apply-doctor", auth, async (req, res) => {
    try {
        // console.log(req.body.timings);
        const newDoctor = await doctor({ ...req.body, status: "pending" });
        await newDoctor.save();
        const adminUser = await User.findOne({ isAdmin: true });
        const notifcation = adminUser.notifcation;
        notifcation.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: "/admin/docotrs",
            },
        });
        await User.findByIdAndUpdate(adminUser._id, { notifcation });
        res.status(201).send({
            success: true,
            message: "Doctor Account Applied Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Applying For Doctor",
        });
    }
});
app.post("/get-all-notification", async (req, res) => {
    console.log("hello");
    try {
        const user = await User.findOne({ _id: req.body.userId });
        const seennotification = user.seennotification;
        const notifcation = user.notifcation;
        seennotification.push(...notifcation);
        user.notifcation = [];
        user.seennotification = notifcation;

        // user.password = undefined;
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "all notification marked as read",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in notification",
        });
    }
});
app.post("/delete-all-notification", auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.seennotification = [];
        // user.notifcation = [];
        // user.password = undefined;
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "all notification deleted",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in notification",
        });
    }
});

app.get("/get-all-users", auth, async (req, res) => {
    try {
        const users = await User.find({});
        await res.status(200).send({
            success: true,
            message: "all users fetched",
            data: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in fetching",
        });
    }
});
app.get("/get-all-doctors", auth, async (req, res) => {
    try {
        const doctors = await doctor.find({});
        await res.status(200).send({
            success: true,
            message: "all docters fetched",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in fetching",
        });
    }
});

app.post("/change-account-status", async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctors = await doctor.findByIdAndUpdate(doctorId, { status });
        console.log(doctors);
        const user = await User.findOne({ _id: doctors.userId });
        const notifcation = user.notifcation;
        notifcation.push({
            type: "doctor-account-request-updated",
            message: `Your Doctor Account Request Has ${status} `,
            onClickPath: "/notification",
        });
        user.isDoctor = status === "approved" ? true : false;
        await user.save();
        res.status(201).send({
            success: true,
            message: "Account Status Updated",
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror in Account Status",
            error,
        });
    }
});
app.post("/getDoctorInfo", auth, async (req, res) => {
    try {
        const doctors = await doctor.findOne({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: "doctor data fetch success",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Fetching Doctor Details",
        });
    }
});
app.post("/updateDoctorProfile", auth, async (req, res) => {
    try {
        const doctors = await doctor.findOneAndUpdate({ userId: req.body.userId }, req.body);
        res.status(201).send({
            success: true,
            message: "Doctor Profile Updated",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Doctor Profile Update issue",
            error,
        });
    }
});
app.get("/getAllDoctors", auth, async (req, res) => {
    try {
        const doctors = await doctor.find({ status: "approved" });
        res.status(201).send({
            success: true,
            message: "doctors data fetched",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error while fetching doctor",
            error,
        });
    }
});
app.post("/getDoctorById", auth, async (req, res) => {
    try {
        const doctors = await doctor.findOne({ _id: req.body.doctorId });
        res.status(201).send({
            success: true,
            message: "doctor data fetched",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in single doctor",
            error,
        });
    }
});
app.post("/book-appointment", auth, async (req, res) => {
    try {
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        req.body.status = "pending";
        console.log(req.body);
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const user = await User.findOne({ _id: req.body.doctorInfo.userId });
        user.notifcation.push({
            type: "New-appointment-request",
            message: `A new Appointment Request from ${req.body.userInfo.name}`,
            onCLickPath: "/user/appointments",
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Book succesfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Booking Appointment",
        });
    }
});
app.post("/booking-availbility", auth, async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime,
                $lte: toTime,
            },
        });
        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not Availibale at this time",
                success: true,
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointments available",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In Booking",
        });
    }
});
app.get("/user-appointments", auth, async (req, res) => {
    try {
        const appointments = await appointmentModel.find({
            userId: req.body.userId,
        });
        res.status(200).send({
            success: true,
            message: "Users Appointments Fetch SUccessfully",
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In User Appointments",
        });
    }
});
app.get("/doctor-appointment" , auth , async(req , res) => {
    try {
        const doctors = await doctor.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({
          doctorId: doctors._id,
        });
        res.status(200).send({
          success: true,
          message: "Doctor Appointments fetch Successfully",
          data: appointments,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in Doc Appointments",
        });
      }
})
app.post("/update-status" , auth , async(req , res)=> {
    try {
        const { appointmentsId, status } = req.body;
        const appointments = await appointmentModel.findByIdAndUpdate(
          appointmentsId,
          { status }
        );
        const user = await User.findOne({ _id: appointments.userId });
        const notifcation = user.notifcation;
        notifcation.push({
          type: "status-updated",
          message: `your appointment has been updated ${status}`,
          onCLickPath: "/doctor-appointments",
        });
        await user.save();
        res.status(200).send({
          success: true,
          message: "Appointment Status Updated",
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error In Update Status",
        });
      }
})
const port = 8000;
app.listen(port, () => {
    console.log("server is running");
});
