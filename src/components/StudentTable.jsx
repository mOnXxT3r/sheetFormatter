import React from "react";
import "./StudentTable.scss";
import { useNavigate } from "react-router-dom";

const StudentTable = ({ students, selectedFields }) => {
  const navigate = useNavigate();

  const handleStudentClick = (student) => {
    navigate(`/student/${student.ROLLNO.replace(/,+$/, "")}`, { state: { student } });
  };

  if (!students || students.length === 0) {
    return <p>No student data available.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>S. No.</th>
            {selectedFields.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr 
              key={student.ROLLNO ? `${student.ROLLNO}-${idx}` : idx} 
              onClick={() => handleStudentClick(student)} 
              className="clickable-row"
            >
              <td>{idx + 1}</td>
              {selectedFields.map((key) => (
                <td key={`${student.ROLLNO || idx}-${key}`}>
                  {typeof student[key] === "string"
                    ? student[key].replace(/,+$/, "")
                    : student[key] ?? ""}
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
