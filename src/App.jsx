import { Routes, Route } from "react-router-dom";

import Header from "./shared/Header";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MeetingForm from "./components/MeetingForm";
import Dashboard from "./components/Dashboard";
import PrivateRoutes from "./components/PrivateRoutes";
import Profile from "./components/Profile";

import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" index element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/create-meeting" element={<MeetingForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </>
  );
}

export default App;
