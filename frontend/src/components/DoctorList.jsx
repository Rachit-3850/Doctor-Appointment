import React from "react";
import { useNavigate } from "react-router-dom";


const DoctorList = ({ doctor }) => {
    console.log(doctor)
    const navigate = useNavigate();
    return(
        <div>
            <div
                className="card m-2 dortorList"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
            >
                <div className="card-header">
                    Dr. {doctor.firstName} {doctor.lastName}
                </div>
                <div className="card-body">
                    <p>
                        <b>Specialization</b> {doctor.specialization}
                    </p>
                    <p>
                        <b>Experience</b> {doctor.experience}
                    </p>
                    <p>
                        <b>Fees Per Cunsaltation</b> {doctor.feesPerCunsaltation}
                    </p>
                    <p>
                        <b>Contact</b> {doctor.phone}
                    </p>
                    <p>
                        <b>Address</b> {doctor.address}
                    </p>
                </div>
            </div>
        </div>
    )
    
};
// {/* <p>
// {/* {console.log(doctor.timings)} */}
// <b>Timings</b> {doctor.timings[0]} - {doctor.timings[1]}
// </p> */}
export default DoctorList;
