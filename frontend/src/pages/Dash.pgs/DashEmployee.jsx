import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLogForm from "../../components/EmployeeComponents/EmployeeLogForm";
import "./Dash.css";

export default function DashEmployee() {
  const navigate  = useNavigate();
  const employee  = JSON.parse(localStorage.getItem("employee") || "{}");

  useEffect(() => {
    if (!employee.id) navigate("/login/employee");
  }, []);

  return (
    <section className="page-container">
      <div className="emp-home">
        <div className="emp-home-header">
          <h2 className="emp-home-title">
            Welcome, {employee.first_name}
          </h2>
          <p className="emp-home-sub">{employee.position || "Employee"}</p>
        </div>

        {/* log form — main feature of employee home */}
        <EmployeeLogForm employeeId={employee.id} />
      </div>
    </section>
  );
}