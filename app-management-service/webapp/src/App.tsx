import HomePage from "./pages/HomePage";
import ApptPage from "./pages/ApptPage";
import UserPage from "./pages/UserPage";

import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/users" Component={UserPage} />
          <Route path="/appointments" Component={ApptPage} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}
