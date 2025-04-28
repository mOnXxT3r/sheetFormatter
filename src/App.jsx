import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ExcelUploader from "./components/ExcelUploader";
import StudentDetails from "./components/StudentDetails";
import PaperCount from "./components/PaperCount";
import Header from "./components/Header";
import { Provider } from "react-redux";
import { store } from "./store";
import About from "./components/About";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/sheetFormatter" replace />} />
          <Route path="/sheetFormatter" element={<ExcelUploader />} />
          <Route path="/student/:id" element={<StudentDetails />} />
          <Route path="/paperCount" element={<PaperCount />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<div className="p-4">404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
