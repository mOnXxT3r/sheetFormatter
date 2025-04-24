import React from "react";
import "./StudentTable.css";

const StudentTable = ({ students }) => {
  if (!students || students.length === 0) {
    return <p>No student data available.</p>;
  }

  const includedFields = ["ROLLNO", "ENRLNO", "SNAME"];

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>S. No.</th>
            {includedFields.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              {includedFields.map((key) => (
                <td key={key}>{student[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
