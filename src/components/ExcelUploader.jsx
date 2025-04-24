import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./ExcelUploader.css";
import StudentTable from "./StudentTable";
import BULogo from "../assets/BU-Logo.png";

const ExcelUploader = () => {
  const [excelData, setExcelData] = useState([]);
  const [uniquePapers, setUniquePapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  const handleFileUpload = (e) => {
    setSelectedPaper("");
    const files = Array.from(e.target.files);
    const allData = [];
    const allPaperNames = new Set();
    let filesProcessed = 0;

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        allData.push(...jsonData);

        jsonData.forEach((row) => {
          if (row.paper_name) {
            row.paper_name
              .split("|")
              .map((paper) => paper.trim())
              .filter(Boolean)
              .forEach((paper) => allPaperNames.add(paper));
          }
        });

        filesProcessed++;
        if (filesProcessed === files.length) {
          setExcelData(allData);
          setUniquePapers([...allPaperNames]);
        }
      };

      reader.readAsArrayBuffer(file);
    });
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

    const exportData = filteredStudents.map((student, index) => ({
      "S. No.": index + 1,
      ROLLNO: student.ROLLNO?.replace(/[^a-zA-Z0-9]/g, "") || "",
      ENRLNO: student.ENRLNO?.replace(/[^a-zA-Z0-9]/g, "") || "",
      SNAME: student.SNAME || "",
      "Extra Column for Remark": "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

    XLSX.writeFile(workbook, `Filtered-Students-${selectedPaper}.xlsx`);
  };

  return (
    <div className="uploader-container">
      <header className="heading-container">
        <div className="logo-container">
          <img src={BULogo} alt="BULogo" />
        </div>
        <h1>
          Barkatullah <br /> Vishwavidyalaya
        </h1>
        <div className="header-right">
          <h2 className="uploader-title">XLS File Formatter</h2>
          <p>Upload, filter and format your Excel files</p>
        </div>
      </header>

      <div className="mid-section">
        <label className="file-upload-wrapper">
          <h3>Upload XLS file</h3>
          <input
            className="file-input"
            type="file"
            accept=".xls, .xlsx"
            multiple
            onChange={handleFileUpload}
          />
        </label>

        <div className="paper-select-wrapper">
          {uniquePapers.length > 0 && (
            <>
              <label for="paper-select" class="paper-label">
                Filter by Paper:
              </label>
              <select
                id="paper-select"
                className="paper-select"
                value={selectedPaper}
                onChange={handlePaperSelect}
              >
                <option value="">Filter by Paper:</option>
                {uniquePapers.map((paper, index) => (
                  <option key={index} value={paper}>
                    {paper}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {selectedPaper && (
        <>
          <h3 style={{ marginTop: "1.5rem", color: "black", textAlign: "left" }}>
            Students with Paper: {selectedPaper} | {filteredStudents.length} students out of{" "}
            {excelData.length} in Total
          </h3>
          <div>
            <StudentTable students={filteredStudents} />
          </div>
        </>
      )}

      {selectedPaper !== "" && filteredStudents.length > 0 && (
        <button onClick={downloadExcel} className="download-btn">
          ⬇ Download Formatted File
        </button>
      )}
    </div>
  );
};

export default ExcelUploader;
