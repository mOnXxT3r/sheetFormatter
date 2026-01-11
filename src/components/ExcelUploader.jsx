import React, { useMemo } from "react";
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
  setSelectedFields,
  initialSelectedFields,
} from "../redux/excelUploaderSlice";

const ExcelUploader = () => {
  const dispatch = useDispatch();
  const { excelData, uniquePapers, selectedPaper, selectedFields, filteredStudents } = useSelector(
    (state) => state.excelUploader
  );

  const allFields = useMemo(() => {
    if (excelData.length > 0) {
      return Object.keys(excelData[0]).filter(
        (key) => typeof excelData[0][key] === "string"
      );
    }
    return [];
  }, [excelData]);

  const handleFileUpload = (e) => {
    dispatch(resetUploader());
    dispatch(setSelectedFields(initialSelectedFields));

    const files = Array.from(e.target.files);
    const allData = [];
    const allPaperNames = new Set();
    let filesProcessed = 0;

    const dispatchData = () => {
      if (allData.length === 0) return;
      
      dispatch(
        setExcelData(
          allData.sort((a, b) => {
            const rollA = parseInt(a.ROLLNO?.replace(/,/g, "") || "0", 10) || 0;
            const rollB = parseInt(b.ROLLNO?.replace(/,/g, "") || "0", 10) || 0;
            return rollA - rollB;
          })
        )
      );
      dispatch(
        setUniquePapers(
          [...allPaperNames].sort((a, b) => {
            const codeA = parseInt(a.split(" - ")[0] || "0", 10) || 0;
            const codeB = parseInt(b.split(" - ")[0] || "0", 10) || 0;
            return codeA - codeB;
          })
        )
      );
    };

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            console.error("No sheets found in file:", file.name);
            filesProcessed++;
            if (filesProcessed === files.length && allData.length > 0) {
              dispatchData();
            }
            return;
          }

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
            dispatchData();
          }
        } catch (error) {
          console.error("Error processing file:", file.name, error);
          filesProcessed++;
          if (filesProcessed === files.length && allData.length > 0) {
            dispatchData();
          }
        }
      };

      reader.onerror = () => {
        console.error("Error reading file:", file.name);
        filesProcessed++;
        if (filesProcessed === files.length && allData.length > 0) {
          dispatchData();
        }
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleFieldToggle = (field) => {
    const updatedFields = selectedFields.includes(field)
      ? selectedFields.filter((f) => f !== field)
      : [...selectedFields, field];
    dispatch(setSelectedFields(updatedFields));
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
        const rollA = parseInt(a.ROLLNO?.replace(/,/g, "") || "0", 10) || 0;
        const rollB = parseInt(b.ROLLNO?.replace(/,/g, "") || "0", 10) || 0;
        return rollA - rollB;
      });

    dispatch(setFilteredStudents(filtered));
  };

  const downloadExcel = () => {
    if (!filteredStudents || filteredStudents.length === 0) return;

    const exportData = filteredStudents.map((student, index) => {
      const row = {
        "S. No.": index + 1,
      };
      selectedFields.forEach((field) => {
        row[field] =
          typeof student[field] === "string"
            ? student[field].replace(/[^a-zA-Z0-9 ]/g, "")
            : student[field];
      });
      row["Extra Column for Remark"] = "";
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 🔥 Auto-size columns based on content
    const columnWidths = exportData.length > 0 
      ? Object.keys(exportData[0]).map((key) => {
          const maxLength = exportData.reduce((max, row) => {
            const value = row[key] ? String(row[key]) : "";
            return Math.max(max, value.length);
          }, key.length);
          return { wch: maxLength + 2 };
        })
      : [];

    worksheet["!cols"] = columnWidths;

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
                {uniquePapers.map((paper) => (
                  <option key={paper} value={paper}>
                    {paper}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {allFields.length > 0 && (
        <div className="field-selection">
          <h4>Select Fields to Display:</h4>
          <div className="checkbox-inline">
            {allFields.map((field) => (
              <label key={field} className="checkbox-label-inline">
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field)}
                  onChange={() => handleFieldToggle(field)}
                />
                {field}
              </label>
            ))}
          </div>
        </div>
      )}

      {(selectedPaper && filteredStudents.length > 0) ||
      (excelData && filteredStudents.length === 0) ? (
        <>
          <div className="paper-details">
            <h3 className="paper-details__title">
              {selectedPaper ? `Students Enrolled in Paper : ${selectedPaper}` : "Students List"}
            </h3>
            <p className="paper-details__summary">
              {selectedPaper
                ? `${filteredStudents.length} out of ${excelData.length} Total Students`
                : `${excelData.length} Total Students`}
            </p>
          </div>
          <div>
            <StudentTable
              students={selectedPaper ? filteredStudents : excelData}
              selectedFields={selectedFields}
            />
          </div>
        </>
      ) : null}

      {selectedPaper && filteredStudents.length > 0 && (
        <button onClick={downloadExcel} className="download-btn">
          ⬇ Download Formatted File
        </button>
      )}
    </div>
  );
};

export default ExcelUploader;
