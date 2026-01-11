import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import "./PaperCount.scss";

const PaperCount = () => {
  const { excelData, uniquePapers } = useSelector((state) => state.excelUploader);
  
  const paperCounts = useMemo(() => {
    if (!excelData.length || !uniquePapers.length) return [];

    return uniquePapers.map((paperName) => {
      let count = 0;
      excelData.forEach((student) => {
        for (let i = 1; i <= 15; i++) {
          const paperField = `paper_${i}`;
          if (student[paperField] && student[paperField].trim() === paperName) {
            count++;
            break;
          }
        }
      });
      return { paperName, count };
    });
  }, [excelData, uniquePapers]);

  return (
    <div className="paper-count-container">
      {paperCounts.length > 0 ? (
        <>
          <h2 className="paper-count-title">Paper Wise Student Count</h2>

          <table className="paper-count-table">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Paper Name</th>
                <th>Student Count</th>
              </tr>
            </thead>
            <tbody>
              {paperCounts.map((paper, index) => (
                <tr key={paper.paperName}>
                  <td>{index + 1}</td>
                  <td>{paper.paperName}</td>
                  <td>{paper.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="no-data-text">No data available. Please upload and select papers first.</p>
      )}
    </div>
  );
};

export default PaperCount;
