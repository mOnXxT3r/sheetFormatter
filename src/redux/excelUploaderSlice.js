import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  excelData: [],
  uniquePapers: [],
  selectedPaper: "",
  filteredStudents: [],
  selectedFields: ["ROLLNO", "ENRLNO", "SNAME"],
};

const excelUploaderSlice = createSlice({
  name: "excelUploader",
  initialState,
  reducers: {
    setExcelData: (state, action) => {
      state.excelData = action.payload;
    },
    setUniquePapers: (state, action) => {
      state.uniquePapers = action.payload;
    },
    setSelectedPaper: (state, action) => {
      state.selectedPaper = action.payload;
    },
    setFilteredStudents: (state, action) => {
      state.filteredStudents = action.payload;
    },
    setSelectedFields: (state, action) => {
      state.selectedFields = action.payload;
    },
    resetUploader: () => initialState,
  },
});

export const {
  setExcelData,
  setUniquePapers,
  setSelectedPaper,
  setFilteredStudents,
  setSelectedFields,
  resetUploader,
} = excelUploaderSlice.actions;

export default excelUploaderSlice.reducer;
