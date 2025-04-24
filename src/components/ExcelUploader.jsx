import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./ExcelUploader.css";
import StudentTable from "./StudentTable";

const ExcelUploader = () => {
  const [excelData, setExcelData] = useState([]);
  const [uniquePapers, setUniquePapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  const handleFileUpload = (e) => {
    setSelectedPaper("");
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      setExcelData(jsonData);

      const paperNamesSet = new Set();
      jsonData.forEach((row) => {
        if (row.paper_name) {
          row.paper_name
            .split("|")
            .map((paper) => paper.trim())
            .filter(Boolean)
            .forEach((paper) => paperNamesSet.add(paper));
        }
      });

      setUniquePapers([...paperNamesSet]);
    };

    reader.readAsArrayBuffer(file);
  };

  const handlePaperSelect = (e) => {
    const selected = e.target.value;
    setSelectedPaper(selected);

    if (!selected) {
      setFilteredStudents([]);
      return;
    }

    const filtered = excelData.filter((student) => {
      for (let i = 1; i <= 15; i++) {
        const paperField = `paper_${i}`;
        if (student[paperField] && student[paperField].trim() === selected) {
          return true;
        }
      }
      return false;
    });

    setFilteredStudents(filtered);
  };

  const downloadExcel = () => {
    if (!filteredStudents || filteredStudents.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

    XLSX.writeFile(workbook, "filtered_students.xlsx");
  };

  return (
    <div className="uploader-container">
      <h2 className="uploader-title">📂 Upload & Filter Excel Data</h2>
      <input className="file-input" type="file" accept=".xls, .xlsx" onChange={handleFileUpload} />

      {uniquePapers.length > 0 && (
        <>
          <label htmlFor="paper-select" className="paper-label">
            🎯 Filter by Paper:
          </label>
          <select
            id="paper-select"
            className="paper-select"
            value={selectedPaper}
            onChange={handlePaperSelect}
          >
            <option value="">-- Select Paper --</option>
            {uniquePapers.map((paper, index) => (
              <option key={index} value={paper}>
                {paper}
              </option>
            ))}
          </select>
        </>
      )}

      {/* <h3 style={{ marginTop: "1.5rem", color: "black" }}>📄 Parsed Data:</h3>
      <div className="data-preview">
        <pre>{JSON.stringify(excelData[0], null, 2)}</pre>
      </div> */}

      {selectedPaper && (
        <>
          <h3 style={{ marginTop: "1.5rem", color: "black" }}>
            🎓 Students with Paper: {selectedPaper}
          </h3>
          <h4 style={{ color: "black" }}>
            Total no. of students: {excelData.length} | No. of students for this paper:{" "}
            {filteredStudents.length}
          </h4>
          <div>
            <StudentTable students={filteredStudents} />
          </div>
        </>
      )}

      {selectedPaper !== "" && filteredStudents.length > 0 && (
        <button onClick={downloadExcel} className="download-btn">
          ⬇ Download XLS
        </button>
      )}
    </div>
  );
};

export default ExcelUploader;
