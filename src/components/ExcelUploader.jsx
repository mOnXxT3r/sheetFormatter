import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import "./ExcelUploader.scss";
import StudentTable from "./StudentTable";
import {
  setExcelData,
  setUniquePapers,
  setSelectedPaper,
  setFilteredStudents,
  resetUploader,
} from "../redux/excelUploaderSlice";

const ExcelUploader = () => {
  const dispatch = useDispatch();
  const { excelData, uniquePapers, selectedPaper, filteredStudents } = useSelector(
    (state) => state.excelUploader
  );

  const handleFileUpload = (e) => {
    dispatch(resetUploader());
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false });

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
          dispatch(setExcelData(allData));
          dispatch(
            setUniquePapers(
              [...allPaperNames].sort((a, b) => {
                const codeA = parseInt(a.split(" - ")[0]);
                const codeB = parseInt(b.split(" - ")[0]);
                return codeA - codeB;
              })
            )
          );
        }
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handlePaperSelect = (e) => {
    const selected = e.target.value;
    dispatch(setSelectedPaper(selected));

    if (!selected) {
      dispatch(setFilteredStudents([]));
      return;
    }

    const filtered = excelData
      .filter((student) => {
        for (let i = 1; i <= 15; i++) {
          const paperField = `paper_${i}`;
          if (student[paperField] && student[paperField].trim() === selected) {
            return true;
          }
        }
        return false;
      })
      .sort((a, b) => {
        const rollA = parseInt(a.ROLLNO.replace(",", ""));
        const rollB = parseInt(b.ROLLNO.replace(",", ""));
        return rollA - rollB;
      });

    dispatch(setFilteredStudents(filtered));
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
      <div className="mid-section">
        <label className="file-upload-wrapper">
          <h3>Select XLS file</h3>
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
              <label htmlFor="paper-select" className="paper-label">
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
          <div className="paper-details">
            <h3 className="paper-details__title">Students Enrolled in Paper : {selectedPaper}</h3>
            <p className="paper-details__summary">
              {filteredStudents.length} out of {excelData.length} Total Students
            </p>
          </div>
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
