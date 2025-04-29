import React from "react";
import { useLocation } from "react-router-dom";
import "./StudentDetails.scss";

const StudentDetails = () => {
  const location = useLocation();
  const student = location.state?.student;

  if (!student) {
    return <p>No student data available.</p>;
  }

  const papers = [];

  for (let i = 1; i <= 15; i++) {
    const paperField = student[`paper_${i}`];
    if (paperField && paperField.trim() !== "- ADDNL -") {
      papers.push({ id: i, paperName: paperField });
    }
  }

  return (
    <>
      <div className="student-details-header">
        <h2>Student Details : {student.SNAME}</h2>
      </div>

      <div className="student-details-container">
        <div className="student-details-card">
          <div className="student-details-body">
            <div className="student-info-row">
              <span className="label">Enrollment No.: {student.ENRLNO.replace(/,+$/, "")}</span>
            </div>

            <div className="student-info-row">
              <span className="label">Roll No.: {student.ROLLNO.replace(/,+$/, "")}</span>
            </div>

            <div className="student-info-row">
              <span className="label">Father's Name: {student.FNAME}</span>
            </div>

            <div className="student-info-row">
              <span className="label">Mother's Name: {student.MNAME}</span>
            </div>

            <div className="student-info-row">
              <span className="label">Date of Birth: {student.DOB}</span>
            </div>

            <div className="student-info-row">
              <span className="label">Caste: {student.CASTE}</span>
            </div>

            <div className="student-info-row">
              <span className="label">Status: {student.STATUS}</span>
            </div>

            <div className="paper-table-container">
              <h3 className="papers-title">Papers Enrolled</h3>
              <table className="papers-table">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>S. No.</th>
                    <th>Paper Name</th>
                  </tr>
                </thead>
                <tbody>
                  {papers.map((paper, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{paper.paperName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetails;
