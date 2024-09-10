import { Routes, Route } from "react-router-dom";

import Header from "./shared/Header";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MeetingForm from "./components/MeetingForm";

import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/create-meeting" element={<MeetingForm />} />
      </Routes>
    </>
  );
}

export default App;
