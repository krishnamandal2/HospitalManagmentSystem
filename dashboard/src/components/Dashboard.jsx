import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        toast.error("Failed to load appointments. Please try again.");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const renderTable = () => (
    <table>
      <thead>
        <tr>
          <th>Patient</th>
          <th>Date</th>
          <th>Doctor</th>
          <th>Department</th>
          <th>Status</th>
          <th>Visited</th>
        </tr>
      </thead>
      <tbody>
        {appointments.length > 0
          ? appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                <td>{new Date(appointment.appointment_date).toLocaleString()}</td>
                <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                <td>{appointment.department}</td>
                <td>
                  <select
                    className={
                      appointment.status === "Pending"
                        ? "value-pending"
                        : appointment.status === "Accepted"
                        ? "value-accepted"
                        : "value-rejected"
                    }
                    value={appointment.status}
                    onChange={(e) =>
                      handleUpdateStatus(appointment._id, e.target.value)
                    }
                    disabled={appointment.status !== "Pending"}
                  >
                    <option value="Pending" className="value-pending">Pending</option>
                    <option value="Accepted" className="value-accepted">Accepted</option>
                    <option value="Rejected" className="value-rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  {appointment.hasVisited ? (
                    <GoCheckCircleFill className="green" aria-label="Visited" />
                  ) : (
                    <AiFillCloseCircle className="red" aria-label="Not Visited" />
                  )}
                </td>
              </tr>
            ))
          : "No Appointments Found!"}
      </tbody>
    </table>
  );

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
              </div>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{appointments.reduce((acc, app) => {
              acc.add(app.doctor._id);
              return acc;
            }, new Set()).size}</h3>
          </div>
        </div>

        <div className="banner">
          <h5>Appointments</h5>
          {loading ? <p>Loading appointments...</p> : renderTable()}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
