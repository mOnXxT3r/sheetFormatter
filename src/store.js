import { configureStore } from "@reduxjs/toolkit";
import excelUploaderReducer from "./redux/excelUploaderSlice";

export const store = configureStore({
  reducer: {
    excelUploader: excelUploaderReducer,
  },
});
