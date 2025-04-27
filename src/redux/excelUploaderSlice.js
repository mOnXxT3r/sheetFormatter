import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  excelData: [],
  uniquePapers: [],
  selectedPaper: "",
  filteredStudents: [],
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
    resetUploader: () => initialState,
  },
});

export const {
  setExcelData,
  setUniquePapers,
  setSelectedPaper,
  setFilteredStudents,
  resetUploader,
} = excelUploaderSlice.actions;

export default excelUploaderSlice.reducer;
