import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import ResultsPage from "./results";
import { HashRouter, Routes, Route } from "react-router";

function Main() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
