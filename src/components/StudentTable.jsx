import React from "react";
import "./StudentTable.scss";
import { useNavigate } from "react-router-dom";

const StudentTable = ({ students }) => {
  const navigate = useNavigate();

  const handleStudentClick = (student) => {
    navigate(`/student/${student.ROLLNO.replace(/,+$/, "")}`, { state: { student } });
  };

  if (!students || students.length === 0) {
    return <p>No student data available.</p>;
  }

  const includedFields = ["ROLLNO", "ENRLNO", "SNAME"];

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>S. No.</th>
            {includedFields.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr key={idx} onClick={() => handleStudentClick(student)} className="clickable-row">
              <td>{idx + 1}</td>
              {includedFields.map((key) => (
                <td key={key}>
                  {typeof student[key] === "string"
                    ? student[key].replace(/,+$/, "")
                    : student[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
