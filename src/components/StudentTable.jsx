import React, { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import "./StudentTable.css";

const StudentTable = ({ students }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!students || students.length === 0) {
    return <p>No student data available.</p>;
  }

  const includedFields = [
    "EXAMNAME",
    "SEMESTER",
    "APPNO",
    "ROLLNO",
    "ENRLNO",
    "SNAME",
    "STATUS",
    "CASTE",
    "SEX",
  ];

  const handleCopy = (text, fieldKey, rowIndex) => {
    navigator.clipboard.writeText(text);
    setCopiedField(`${fieldKey}-${rowIndex}`);
    setTimeout(() => setCopiedField(null), 1000); // Reset copied field
  };

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            {includedFields.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr key={idx}>
              {includedFields.map((key) => (
                <td key={key}>
                  {student[key]}
                  {(key === "ROLLNO" || key === "ENRLNO") && student[key] && (
                    <FaRegCopy
                      onClick={() => handleCopy(student[key], key, idx)}
                      style={{
                        cursor: "pointer",
                        marginLeft: "6px",
                        color: "#007bff",
                      }}
                      title={copiedField === `${key}-${idx}` ? "Copied!" : "Copy"}
                    />
                  )}
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
